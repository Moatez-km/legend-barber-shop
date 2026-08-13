import { Scissors, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "James T.",
      text: "Bester Barbershop der Stadt! Immer konstant und professionell. Ich liebe die Atmosphäre und die Ergebnisse.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Michael R.",
      text: "Saubere Fades, toller Service und freundliche Barbiere. Sehr zu empfehlen!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "David L.",
      text: "Ich bekomme jedes Mal Komplimente! Diese Jungs wissen, was sie tun.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-brand font-semibold text-sm tracking-widest uppercase mb-2">Was Unsere Kunden Sagen</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#121212] mb-4">Zufriedene Kunden</h2>
          <div className="flex items-center justify-center gap-2 text-brand">
            <div className="h-px w-12 bg-brand/30"></div>
            <Scissors size={20} className="transform rotate-90" />
            <div className="h-px w-12 bg-brand/30"></div>
          </div>
        </div>

        <div className="relative pb-10">
          {/* Controls */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 lg:-ml-12 w-10 h-10 bg-[#121212] hover:bg-brand text-white hover:text-black rounded-full flex items-center justify-center transition-colors z-10 shadow-lg">
            <ChevronLeft size={20} />
          </button>
          
          <button className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 lg:-mr-12 w-10 h-10 bg-[#121212] hover:bg-brand text-white hover:text-black rounded-full flex items-center justify-center transition-colors z-10 shadow-lg">
            <ChevronRight size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white border border-brand/20 p-8 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow relative">
                {/* Rating */}
                <div className="flex gap-1 text-brand mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-8 min-h-[70px] text-sm">"{test.text}"</p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full object-cover border-2 border-brand/30" />
                  <div>
                    <p className="font-bold text-[#121212] text-sm">- {test.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
