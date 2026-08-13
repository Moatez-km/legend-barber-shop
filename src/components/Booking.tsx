import React, { useState, useEffect } from 'react';
import { Calendar, User, Scissors, Clock, Phone, Check, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';

interface BarberSchedule {
  // Days of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  [day: number]: { start: string; end: string; breakStart?: string; breakEnd?: string } | null;
}

interface Barber {
  id: string;
  name: string;
  role: string;
  avatar: string;
  schedule: BarberSchedule;
}

interface Service {
  id: string;
  name: string;
  price: string;
  duration: number; // minutes
  desc: string;
}

interface Booking {
  date: string; // YYYY-MM-DD
  barberId: string;
  time: string; // HH:MM
}

const COMMON_SCHEDULE: BarberSchedule = {
  1: { start: "09:00", end: "20:00", breakStart: "13:00", breakEnd: "14:00" }, // Mon
  2: { start: "09:00", end: "20:00", breakStart: "13:00", breakEnd: "14:00" }, // Tue
  3: { start: "09:00", end: "20:00", breakStart: "13:00", breakEnd: "14:00" }, // Wed
  4: { start: "09:00", end: "20:00", breakStart: "13:00", breakEnd: "14:00" }, // Thu
  5: { start: "09:00", end: "20:00", breakStart: "13:00", breakEnd: "14:00" }, // Fri
  6: { start: "09:00", end: "20:00", breakStart: "13:00", breakEnd: "14:00" }, // Sat
  0: null // Sun (Off)
};

const BARBERS: Barber[] = [
  {
    id: "stefan",
    name: "Stefan",
    role: "Inhaber & Master Barber",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    schedule: COMMON_SCHEDULE
  },
  {
    id: "ahmed",
    name: "Ahmed",
    role: "Fade-Spezialist",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    schedule: COMMON_SCHEDULE
  },
  {
    id: "marco",
    name: "Marco",
    role: "Bart- & Rasurexperte",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    schedule: COMMON_SCHEDULE
  }
];

const SERVICES: Service[] = [
  { id: "haarschnitt", name: "Haarschnitt", price: "30€", duration: 20, desc: "Klassische Schnitte, abgestimmt auf Ihren Stil" },
  { id: "bartpflege", name: "Bartpflege", price: "20€", duration: 20, desc: "Präzises Formen & Pflegen des Bartes" },
  { id: "nassrasur", name: "Klassische Nassrasur", price: "30€", duration: 20, desc: "Entspannende Rasur mit dem Rasiermesser" },
  { id: "kinder", name: "Kinderhaarschnitt", price: "25€", duration: 20, desc: "Stylische Schnitte für Kinder & Jugendliche" },
  { id: "design", name: "Haar-Design", price: "15€+", duration: 20, desc: "Individuelle Designs & Konturen" },
  { id: "wäsche", name: "Haarwäsche", price: "10€", duration: 20, desc: "Erfrischung mit einer Premium-Haarwäsche" }
];

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRelativeDateString = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return getLocalDateString(date);
};

export default function Booking() {
  const todayStr = getLocalDateString(new Date());

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedBarberId, setSelectedBarberId] = useState<string>(BARBERS[0].id);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Bookings state (initialized with mock bookings relative to current date)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const today = getRelativeDateString(0);
    const tomorrow = getRelativeDateString(1);
    const dayAfter = getRelativeDateString(2);
    return [
      { date: today, barberId: "stefan", time: "10:00" },
      { date: today, barberId: "stefan", time: "10:20" },
      { date: today, barberId: "stefan", time: "13:00" },
      { date: today, barberId: "ahmed", time: "14:00" },
      { date: today, barberId: "ahmed", time: "14:20" },
      { date: today, barberId: "ahmed", time: "18:00" },
      { date: today, barberId: "marco", time: "11:00" },
      { date: today, barberId: "marco", time: "11:20" },
      { date: tomorrow, barberId: "stefan", time: "09:20" },
      { date: tomorrow, barberId: "stefan", time: "11:40" },
      { date: tomorrow, barberId: "ahmed", time: "15:00" },
      { date: tomorrow, barberId: "marco", time: "14:20" },
      { date: dayAfter, barberId: "stefan", time: "10:00" },
      { date: dayAfter, barberId: "ahmed", time: "16:40" },
      { date: dayAfter, barberId: "marco", time: "12:00" }
    ];
  });

  // UI state
  const [successBooking, setSuccessBooking] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Auto-reset selected time if date or barber changes
  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate, selectedBarberId]);

  // Find objects
  const selectedBarber = BARBERS.find(b => b.id === selectedBarberId) || BARBERS[0];
  const selectedService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[0];

  // Check week day and availability of barber
  const selectedDateObj = new Date(selectedDate);
  const dayOfWeek = selectedDateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const isBarberOff = selectedBarber.schedule[dayOfWeek] === null;

  // Generate slots
  const getSlots = () => {
    const shift = selectedBarber.schedule[dayOfWeek];
    if (!shift) return [];

    const parseTimeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const shiftStart = parseTimeToMinutes(shift.start);
    const shiftEnd = parseTimeToMinutes(shift.end);
    const breakStart = shift.breakStart ? parseTimeToMinutes(shift.breakStart) : null;
    const breakEnd = shift.breakEnd ? parseTimeToMinutes(shift.breakEnd) : null;

    const slots = [];
    const duration = 20;

    // Local time comparison helper
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    for (let current = shiftStart; current < shiftEnd; current += duration) {
      const hours = Math.floor(current / 60);
      const minutes = current % 60;
      const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      // Check break
      let isBreak = false;
      if (breakStart !== null && breakEnd !== null) {
        if (current >= breakStart && current < breakEnd) {
          isBreak = true;
        }
      }

      // Check past (only for today)
      const isPast = selectedDate === todayStr && current <= currentTotalMinutes;

      // Check already booked
      const isBooked = bookings.some(
        b => b.date === selectedDate && b.barberId === selectedBarberId && b.time === timeStr
      );

      slots.push({
        time: timeStr,
        isBreak,
        isPast,
        isBooked,
        disabled: isBreak || isPast || isBooked
      });
    }

    return slots;
  };

  const timeSlots = getSlots();

  const handleBookingSubmit = (e: React.FormEvent) => {
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

    // Verify booking is not already taken in state
    const isAlreadyBooked = bookings.some(
      b => b.date === selectedDate && b.barberId === selectedBarberId && b.time === selectedTime
    );

    if (isAlreadyBooked) {
      setErrorMessage("Diese Uhrzeit ist leider bereits vergeben. Bitte wählen Sie eine andere Zeit.");
      return;
    }

    // Add booking
    const newBooking: Booking = {
      date: selectedDate,
      barberId: selectedBarberId,
      time: selectedTime
    };

    setBookings(prev => [...prev, newBooking]);
    setErrorMessage('');

    // Trigger success Modal
    setSuccessBooking({
      name: customerName,
      phone: phone,
      date: selectedDate,
      time: selectedTime,
      barber: selectedBarber.name,
      service: selectedService.name,
      price: selectedService.price
    });
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
            <Scissors size={20} className="transform rotate-90" />
            <div className="h-px w-12 bg-brand/30"></div>
          </div>
          <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm">
            Wählen Sie Ihren bevorzugten Service, Barbier und ein freies Zeitfenster. Sichern Sie sich Ihren Premium-Haarschnitt.
          </p>
        </div>

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
                  {BARBERS.map((barber) => {
                    const isSelected = selectedBarberId === barber.id;
                    const shiftToday = barber.schedule[dayOfWeek];
                    
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
                        <img 
                          src={barber.avatar} 
                          alt={barber.name} 
                          className={`w-10 h-10 rounded-full object-cover border ${
                            isSelected ? 'border-brand' : 'border-gray-700'
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{barber.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{barber.role}</p>
                          <p className="text-[9px] text-brand/70 mt-0.5 font-sans">
                            {shiftToday ? `${shiftToday.start} - ${shiftToday.end}` : 'Frei / Off'}
                          </p>
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
                  {SERVICES.map((srv) => {
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
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{srv.desc}</p>
                        </div>
                        <span className="font-bold text-brand text-sm whitespace-nowrap shrink-0">{srv.price}</span>
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
                      {selectedBarber.name} arbeitet nicht am {formatDateGerman(selectedDate).split(',')[0]}.
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
                        } else if (slot.isBreak) {
                          statusText = "Pause";
                          btnStyle = "bg-[#1f1f1f] text-brand/30 border-gray-900 cursor-not-allowed opacity-40";
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
                            {(slot.isBooked || slot.isPast || slot.isBreak) && (
                              <span className="text-[7px] tracking-wide text-gray-500 leading-none uppercase mt-0.5">
                                {slot.isBooked ? 'belegt' : slot.isBreak ? 'pause' : 'vorbei'}
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
                      <span className="font-bold text-white">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800/40 pb-1.5">
                      <span>Barbier:</span>
                      <span className="font-bold text-white">{selectedBarber.name}</span>
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
                      <span className="text-brand text-base">{selectedService.price}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  disabled={!selectedTime || isBarberOff}
                  className={`w-full py-4 text-center font-bold text-sm transition-all duration-300 uppercase tracking-wider ${
                    selectedTime && !isBarberOff
                      ? 'bg-brand hover:bg-brand-hover text-black cursor-pointer shadow-[0_4px_20px_rgba(210,164,90,0.25)] hover:shadow-[0_4px_25px_rgba(210,164,90,0.35)]'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Termin Jetzt Reservieren
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      {successBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
          <div className="bg-[#1c1c1c] border border-brand/30 rounded-lg max-w-md w-full p-6 md:p-8 relative shadow-2xl animate-fade-in text-center">
            
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
              Vielen Dank, <span className="text-white font-bold">{successBooking.name}</span>. Ihr Termin wurde erfolgreich gebucht.
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
