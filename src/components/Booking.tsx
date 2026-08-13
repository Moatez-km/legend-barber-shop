import React, { useState, useEffect } from 'react';
import { Calendar, User, Scissors, Clock, Phone, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Barber {
  id: string;
  name: string;
  active: boolean;
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  active: boolean;
}

export default function Booking() {
  const todayStr = new Date().toLocaleDateString('sv-SE'); // Gets YYYY-MM-DD format safely in local timezone

  // Database Data States
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [shopSchedules, setShopSchedules] = useState<any[]>([]);
  const [barberSchedules, setBarberSchedules] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Form selections
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 1. Fetch initial static/semi-static data (barbers, services, schedules) on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        // Fetch active barbers
        const { data: barbersData, error: barbersErr } = await supabase
          .from('barbers')
          .select('*')
          .eq('active', true)
          .order('name');

        if (barbersErr) throw barbersErr;

        // Fetch active services
        const { data: servicesData, error: servicesErr } = await supabase
          .from('services')
          .select('*')
          .eq('active', true)
          .order('price', { ascending: true });

        if (servicesErr) throw servicesErr;

        // Fetch shop schedules
        const { data: shopData, error: shopErr } = await supabase
          .from('shop_schedules')
          .select('*');

        if (shopErr) throw shopErr;

        // Fetch barber schedules
        const { data: barberSchedData, error: barberSchedErr } = await supabase
          .from('barber_schedules')
          .select('*')
          .eq('is_available', true);

        if (barberSchedErr) throw barberSchedErr;

        setBarbers(barbersData || []);
        setServices(servicesData || []);
        setShopSchedules(shopData || []);
        setBarberSchedules(barberSchedData || []);

        // Default selections
        if (barbersData && barbersData.length > 0) {
          setSelectedBarberId(barbersData[0].id);
        }
        if (servicesData && servicesData.length > 0) {
          setSelectedServiceId(servicesData[0].id);
        }
      } catch (err: any) {
        console.error("Error loading data from Supabase:", err);
        setErrorMessage("Verbindungsfehler zur Spubabase-Datenbank: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // 2. Fetch bookings for selected date whenever date or barber changes
  useEffect(() => {
    async function loadBookings() {
      if (!selectedDate) return;
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('barber_id, reservation_date, reservation_time')
          .eq('reservation_date', selectedDate)
          .eq('status', 'active');

        if (error) throw error;
        setBookings(data || []);
      } catch (err: any) {
        console.error("Error loading reservations:", err);
      }
    }

    loadBookings();
  }, [selectedDate, selectedBarberId]);

  // Auto-reset selected time if date or barber changes
  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate, selectedBarberId]);

  // Find objects
  const selectedBarber = barbers.find(b => b.id === selectedBarberId);
  const selectedService = services.find(s => s.id === selectedServiceId);

  // Check day of week
  const selectedDateObj = new Date(selectedDate);
  const dayOfWeek = selectedDateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // Find shop hours
  const shopDaySchedule = shopSchedules.find(s => s.day_of_week === dayOfWeek);
  const isShopClosed = !shopDaySchedule || !shopDaySchedule.is_open;

  // Find schedules for this barber on this day of the week
  const activeBarberSchedules = barberSchedules.filter(
    s => s.barber_id === selectedBarberId && s.day_of_week === dayOfWeek && s.is_available
  );
  
  const isBarberOff = isShopClosed || activeBarberSchedules.length === 0;

  // 3. Generate slots based on schedules
  const getSlots = () => {
    if (isBarberOff || !shopDaySchedule) return [];

    const parseTimeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const shopStart = parseTimeToMinutes(shopDaySchedule.opening_time);
    const shopEnd = parseTimeToMinutes(shopDaySchedule.closing_time);

    const slots: any[] = [];
    const duration = 20;

    // Local time comparison helper
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    // Generate times for each shift block
    activeBarberSchedules.forEach(shift => {
      const shiftStart = parseTimeToMinutes(shift.start_time);
      const shiftEnd = parseTimeToMinutes(shift.end_time);

      for (let current = shiftStart; current < shiftEnd; current += duration) {
        // Must fit within shop hours
        if (current < shopStart || current >= shopEnd) continue;

        const hours = Math.floor(current / 60);
        const minutes = current % 60;
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        // Check past (only for today)
        const isPast = selectedDate === todayStr && current <= currentTotalMinutes;

        // Check already booked in DB reservations state (format of reservation_time is '10:00:00')
        const isBooked = bookings.some(
          b => b.barber_id === selectedBarberId && 
               b.reservation_date === selectedDate && 
               b.reservation_time.substring(0, 5) === timeStr
        );

        if (slots.some(s => s.time === timeStr)) continue;

        slots.push({
          time: timeStr,
          isPast,
          isBooked,
          disabled: isPast || isBooked
        });
      }
    });

    // Sort chronologically
    slots.sort((a, b) => {
      const minA = parseTimeToMinutes(a.time);
      const minB = parseTimeToMinutes(b.time);
      return minA - minB;
    });

    return slots;
  };

  const timeSlots = getSlots();

  // 4. Handle Submit Booking with Double Booking Prevention
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      setErrorMessage("Bitte wählen Sie ein Datum aus.");
      return;
    }
    if (isBarberOff) {
      setErrorMessage("Der gewählte Barbier arbeitet am ausgewählten Tag nicht.");
      return;
    }
    if (!selectedTime) {
      setErrorMessage("Bitte wählen Sie eine verfügbare Uhrzeit aus.");
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage("Bitte geben Sie Ihren Namen ein.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Bitte geben Sie Ihre Telefonnummer ein.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Step A: Perform pre-check directly on server/database to prevent double booking race condition
      const { data: existingBookings, error: checkError } = await supabase
        .from('reservations')
        .select('id')
        .eq('barber_id', selectedBarberId)
        .eq('reservation_date', selectedDate)
        .eq('reservation_time', selectedTime)
        .eq('status', 'active');

      if (checkError) throw checkError;

      if (existingBookings && existingBookings.length > 0) {
        setErrorMessage("Entschuldigung, dieser Termin wurde gerade eben von einem anderen Kunden gebucht. Bitte wählen Sie eine andere Zeit.");
        
        // Refresh bookings
        const { data: updatedBookings } = await supabase
          .from('reservations')
          .select('barber_id, reservation_date, reservation_time')
          .eq('reservation_date', selectedDate)
          .eq('status', 'active');
        if (updatedBookings) setBookings(updatedBookings);
        setIsSubmitting(false);
        return;
      }

      // Step B: Insert the reservation
      const { data: newReservation, error: insertError } = await supabase
        .from('reservations')
        .insert({
          customer_name: customerName,
          customer_phone: phone,
          barber_id: selectedBarberId,
          service_id: selectedServiceId,
          reservation_date: selectedDate,
          reservation_time: selectedTime,
          status: 'active'
        })
        .select();

      if (insertError) {
        // Catch PostgreSQL double-booking unique index violation (error code 23505)
        if (insertError.code === '23505') {
          throw new Error("double-booking");
        }
        throw insertError;
      }

      // Trigger success Modal
      setSuccessBooking({
        name: customerName,
        phone: phone,
        date: selectedDate,
        time: selectedTime,
        barber: selectedBarber?.name || 'Barbier',
        service: selectedService?.name || 'Service',
        price: selectedService ? `${Math.round(selectedService.price)}€` : ''
      });

      // Refresh bookings in local state
      const { data: updatedBookings } = await supabase
        .from('reservations')
        .select('barber_id, reservation_date, reservation_time')
        .eq('reservation_date', selectedDate)
        .eq('status', 'active');
      if (updatedBookings) setBookings(updatedBookings);

    } catch (err: any) {
      console.error("Booking error:", err);
      if (err.message === "double-booking" || err.code === "23505") {
        setErrorMessage("Entschuldigung, dieser Termin wurde gerade eben von einem anderen Kunden gebucht. Bitte wählen Sie eine andere Zeit.");
      } else {
        setErrorMessage("Fehler beim Speichern der Reservierung: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessBooking(null);
    setSelectedTime('');
    setCustomerName('');
    setPhone('');
  };

  // Helper to format date in German: e.g. "Donnerstag, 13. August 2026"
  const formatDateGerman = (dateString: string) => {
    try {
      const parts = dateString.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <section id="booking-section" className="py-20 bg-[#121212] text-white border-t border-brand/20 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full filter blur-3xl pointer-events-none -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand/5 rounded-full filter blur-3xl pointer-events-none -ml-48 -mb-48"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-brand font-semibold text-sm tracking-widest uppercase mb-2">Ihre Reservierung</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 uppercase">Termin Buchen</h2>
          <div className="flex items-center justify-center gap-2 text-brand">
            <div className="h-px w-12 bg-brand/30"></div>
            <span className="text-brand font-serif">💈</span>
            <div className="h-px w-12 bg-brand/30"></div>
          </div>
          <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm">
            Wählen Sie Ihren bevorzugten Service, Barbier und ein freies Zeitfenster. Sichern Sie sich Ihren Premium-Haarschnitt.
          </p>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="max-w-6xl mx-auto bg-[#1c1c1c] border border-gray-800 rounded-xl p-20 flex flex-col items-center justify-center text-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-sm">Lade Kalender und Verfügbarkeit aus der Cloud-Datenbank...</p>
          </div>
        ) : (
          <>
            {/* Error message */}
            {errorMessage && (
              <div className="max-w-4xl mx-auto mb-8 bg-red-950/50 border border-red-500/50 text-red-200 px-4 py-3 rounded flex items-center gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <span className="text-sm">{errorMessage}</span>
                <button type="button" className="ml-auto text-red-400 hover:text-white" onClick={() => setErrorMessage('')}>
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Booking Card Grid */}
            <div className="max-w-6xl mx-auto bg-[#1c1c1c] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* LEFT COLUMN: Input controls (Form) */}
                <div className="lg:col-span-7 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-800 space-y-6">
                  
                  {/* DATE PICKER */}
                  <div>
                    <label htmlFor="date" className="block text-xs font-semibold text-brand tracking-wider uppercase mb-2 flex items-center gap-2">
                      <Calendar size={14} /> 1. Datum Wählen
                    </label>
                    <input 
                      type="date"
                      id="date"
                      min={todayStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch (err) {
                          // Fallback for older browsers
                        }
                      }}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-brand focus:outline-none rounded px-4 py-3 text-white text-sm transition-colors cursor-pointer"
                      required
                    />
                  </div>

                  {/* BARBER SELECTION */}
                  <div>
                    <label className="block text-xs font-semibold text-brand tracking-wider uppercase mb-2 flex items-center gap-2">
                      <User size={14} /> 2. Barbier Wählen
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {barbers.map((barber) => {
                        const isSelected = selectedBarberId === barber.id;
                        
                        return (
                          <div 
                            key={barber.id}
                            onClick={() => setSelectedBarberId(barber.id)}
                            className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-brand bg-brand/10 shadow-[0_0_15px_rgba(210,164,90,0.15)]' 
                                : 'border-gray-800 bg-[#121212] hover:border-gray-700'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full border border-brand bg-[#121212] flex items-center justify-center text-brand font-serif text-lg shrink-0 select-none">
                              {barber.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">{barber.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">Barbier</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SERVICE SELECTION */}
                  <div>
                    <label htmlFor="service" className="block text-xs font-semibold text-brand tracking-wider uppercase mb-2 flex items-center gap-2">
                      <Scissors size={14} /> 3. Leistung Wählen
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map((srv) => {
                        const isSelected = selectedServiceId === srv.id;
                        return (
                          <div 
                            key={srv.id}
                            onClick={() => setSelectedServiceId(srv.id)}
                            className={`p-3 border rounded cursor-pointer transition-all flex justify-between items-center ${
                              isSelected 
                                ? 'border-brand bg-brand/10 shadow-[0_0_15px_rgba(210,164,90,0.15)]' 
                                : 'border-gray-800 bg-[#121212] hover:border-gray-700'
                            }`}
                          >
                            <div className="min-w-0 mr-2">
                              <p className="font-semibold text-sm truncate">{srv.name}</p>
                              <p className="text-[10px] text-gray-500 truncate mt-0.5">{srv.duration_minutes} min Dauer</p>
                            </div>
                            <span className="font-bold text-brand text-sm whitespace-nowrap shrink-0">{Math.round(srv.price)}€</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CUSTOMER CONTACT DETAILS */}
                  <div className="border-t border-gray-800 pt-6 space-y-4">
                    <p className="text-xs font-semibold text-brand tracking-wider uppercase flex items-center gap-2">
                      <Phone size={14} /> 4. Ihre Kontaktdaten
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="client-name" className="block text-[11px] text-gray-400 mb-1">Name</label>
                        <input 
                          type="text"
                          id="client-name"
                          placeholder="Ihr Vor- & Nachname"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-[#121212] border border-gray-800 focus:border-brand focus:outline-none rounded px-4 py-2.5 text-white text-sm transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="client-phone" className="block text-[11px] text-gray-400 mb-1">Telefonnummer</label>
                        <input 
                          type="tel"
                          id="client-phone"
                          placeholder="z.B. +49 170 1234567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#121212] border border-gray-800 focus:border-brand focus:outline-none rounded px-4 py-2.5 text-white text-sm transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Slots & Submit */}
                <div className="lg:col-span-5 p-6 md:p-10 bg-[#171717] flex flex-col justify-between">
                  
                  <div className="space-y-6">
                    <label className="block text-xs font-semibold text-brand tracking-wider uppercase flex items-center gap-2">
                      <Clock size={14} /> 5. Verfügbare Uhrzeit Wählen
                    </label>

                    {isBarberOff ? (
                      <div className="bg-[#121212] border border-gray-800 rounded p-6 text-center text-gray-400 my-6">
                        <AlertCircle className="mx-auto text-brand mb-2" size={24} />
                        <p className="font-semibold text-sm">Keine Arbeitszeit</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedBarber ? selectedBarber.name : 'Der Barbier'} arbeitet nicht am {formatDateGerman(selectedDate).split(',')[0]}.
                        </p>
                        <p className="text-xs text-brand/60 mt-3">
                          Bitte wählen Sie ein anderes Datum oder einen anderen Barbier.
                        </p>
                      </div>
                    ) : timeSlots.length === 0 ? (
                      <div className="bg-[#121212] border border-gray-800 rounded p-6 text-center text-gray-400 my-6">
                        <AlertCircle className="mx-auto text-brand mb-2" size={24} />
                        <p className="font-semibold text-sm">Keine Zeiten verfügbar</p>
                        <p className="text-xs text-gray-500 mt-1">Für diesen Zeitraum können keine Slots generiert werden.</p>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                          {timeSlots.map((slot) => {
                            const isSelected = selectedTime === slot.time;
                            let statusText = "Frei";
                            let btnStyle = "border-gray-800 bg-[#121212] text-white hover:border-brand/50 hover:text-brand";
                            
                            if (slot.isBooked) {
                              statusText = "Gebucht";
                              btnStyle = "bg-[#1f1f1f] text-gray-600 border-gray-900 cursor-not-allowed line-through opacity-40";
                            } else if (slot.isPast) {
                              statusText = "Vergangen";
                              btnStyle = "bg-[#1f1f1f] text-gray-600 border-gray-900 cursor-not-allowed opacity-40";
                            } else if (isSelected) {
                              btnStyle = "border-brand bg-brand text-black font-bold shadow-[0_0_15px_rgba(210,164,90,0.4)]";
                            }

                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={slot.disabled}
                                onClick={() => setSelectedTime(slot.time)}
                                title={`${slot.time} Uhr (${statusText})`}
                                className={`border rounded py-2 text-center text-xs transition-all duration-200 flex flex-col items-center justify-center ${btnStyle}`}
                              >
                                <span className="font-medium font-sans">{slot.time}</span>
                                {(slot.isBooked || slot.isPast) && (
                                  <span className="text-[7px] tracking-wide text-gray-500 leading-none uppercase mt-0.5">
                                    {slot.isBooked ? 'belegt' : 'vorbei'}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-[10px] text-gray-400 border-t border-gray-800/50 pt-3">
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#121212] border border-gray-800 block"></span> Frei</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#1f1f1f] border border-gray-900 opacity-40 block"></span> Belegt / Vorbei</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-brand block"></span> Ausgewählt</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOOKING SUMMARY & SUBMIT */}
                  <div className="mt-8 border-t border-gray-800 pt-6 space-y-4">
                    <div className="bg-[#121212] p-4 border border-gray-800 rounded">
                      <h4 className="text-xs font-semibold text-brand tracking-wider uppercase mb-3 flex items-center gap-1.5">
                        <Sparkles size={12} /> Buchungsübersicht
                      </h4>
                      <div className="text-xs space-y-2 text-gray-300">
                        <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                          <span>Leistung:</span>
                          <span className="font-bold text-white">{selectedService?.name || 'Bitte wählen'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                          <span>Barbier:</span>
                          <span className="font-bold text-white">{selectedBarber?.name || 'Bitte wählen'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                          <span>Datum:</span>
                          <span className="font-bold text-white">{formatDateGerman(selectedDate)}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                          <span>Uhrzeit:</span>
                          <span className="font-bold text-brand font-sans">
                            {selectedTime ? `${selectedTime} Uhr` : 'Noch nicht gewählt'}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 font-bold text-sm text-white">
                          <span>Gesamtpreis:</span>
                          <span className="text-brand text-base">{selectedService ? `${Math.round(selectedService.price)}€` : '0€'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleBookingSubmit}
                      disabled={!selectedTime || isBarberOff || isSubmitting}
                      className={`w-full py-4 text-center font-bold text-sm transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2 ${
                        selectedTime && !isBarberOff && !isSubmitting
                          ? 'bg-brand hover:bg-brand-hover text-black cursor-pointer shadow-[0_4px_20px_rgba(210,164,90,0.25)] hover:shadow-[0_4px_25px_rgba(210,164,90,0.35)]'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Verarbeite...
                        </>
                      ) : (
                        'Termin Jetzt Reservieren'
                      )}
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </>
        )}
      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      {successBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all animate-fade-in">
          <div className="bg-[#1c1c1c] border border-brand/30 rounded-lg max-w-md w-full p-6 md:p-8 relative shadow-2xl text-center">
            
            <button 
              type="button"
              onClick={closeSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-brand/10 border-2 border-brand rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-brand" size={32} />
            </div>

            <h3 className="font-serif text-2xl text-white mb-2 uppercase tracking-wide">Termin Reserviert!</h3>
            <p className="text-gray-400 text-sm mb-6">
              Vielen Dank, <span className="text-white font-bold">{successBooking.name}</span>. Ihr Termin wurde erfolgreich in der Cloud-Datenbank gebucht.
            </p>

            <div className="bg-[#121212] border border-gray-800 rounded-lg p-4 text-left space-y-3 mb-6 text-xs text-gray-300">
              <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                <span className="text-gray-500">Service:</span>
                <span className="font-bold text-white">{successBooking.service}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                <span className="text-gray-500">Barbier:</span>
                <span className="font-bold text-white">{successBooking.barber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                <span className="text-gray-500">Datum:</span>
                <span className="font-bold text-white">{formatDateGerman(successBooking.date)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                <span className="text-gray-500">Uhrzeit:</span>
                <span className="font-bold text-brand font-sans">{successBooking.time} Uhr</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                <span className="text-gray-500">Telefon:</span>
                <span className="font-bold text-white font-sans">{successBooking.phone}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm text-white">
                <span className="text-gray-500">Preis:</span>
                <span className="text-brand text-base">{successBooking.price}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeSuccessModal}
              className="w-full bg-brand hover:bg-brand-hover text-black font-bold py-3 text-sm transition-colors uppercase tracking-wider"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
