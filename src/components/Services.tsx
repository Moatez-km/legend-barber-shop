import { Scissors } from 'lucide-react';

export default function Services() {
  const services = [
    {
      name: "Haarschnitt",
      desc: "Klassische Schnitte, abgestimmt auf Ihren Stil",
      price: "30€",
      img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=500"
    },
    {
      name: "Bartpflege",
      desc: "Präzises Formen & Pflegen des Bartes",
      price: "20€",
      img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=500"
    },
    {
      name: "Klassische Nassrasur",
      desc: "Entspannende Rasur mit dem Rasiermesser",
      price: "30€",
      img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=500"
    },
    {
      name: "Kinderhaarschnitt",
      desc: "Stylische Schnitte für Kinder & Jugendliche",
      price: "25€",
      img: "https://images.unsplash.com/photo-1527788880629-eb8a9c3fbcc8?auto=format&fit=crop&q=80&w=500"
    },
    {
      name: "Haar-Design",
      desc: "Individuelle Designs & Konturen",
      price: "15€+",
      img: "https://images.unsplash.com/photo-1532798442725-41036acc7489?auto=format&fit=crop&q=80&w=500"
    },
    {
      name: "Haarwäsche",
      desc: "Erfrischung mit einer Premium-Haarwäsche",
      price: "10€",
      img: "https://images.unsplash.com/photo-1516975080661-460d3fcb65cd?auto=format&fit=crop&q=80&w=500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-brand font-semibold text-sm tracking-widest uppercase mb-2">Unsere Leistungen</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#121212] mb-4">Was wir anbieten</h2>
          <div className="flex items-center justify-center gap-2 text-brand">
            <div className="h-px w-12 bg-brand/30"></div>
            <Scissors size={20} className="transform rotate-90" />
            <div className="h-px w-12 bg-brand/30"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden group hover:shadow-xl transition-shadow flex flex-col text-center pb-6">
              <div className="h-40 lg:h-32 xl:h-40 overflow-hidden mb-6 relative">
                <img src={srv.img} alt={srv.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-brand shadow-md z-10">
                   <Scissors size={18} className="text-[#121212]" />
                </div>
              </div>
              <div className="px-3 flex-grow flex flex-col mt-2">
                <h3 className="font-serif text-lg text-[#121212] font-semibold mb-2">{srv.name}</h3>
                <p className="text-gray-500 text-xs mb-4 flex-grow">{srv.desc}</p>
                <p className="text-lg font-bold text-[#121212]">{srv.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#121212] hover:bg-[#1a1a1a] text-white font-semibold px-8 py-4 text-sm transition-colors uppercase tracking-wide rounded-sm">
            Alle Leistungen ansehen
          </button>
        </div>
      </div>
    </section>
  );
}
