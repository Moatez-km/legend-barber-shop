import { Calendar, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] bg-[#121212] overflow-hidden flex items-center">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80)',
          backgroundPosition: 'center 20%'
        }}
      >
        <div className="absolute inset-0 bg-black/60 md:bg-gradient-to-r md:from-black/90 md:via-black/70 md:to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-2xl text-white">
          <p className="text-brand font-semibold text-sm tracking-widest uppercase mb-4">Gut aussehen. Selbstbewusst fühlen.</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6 uppercase">
            Mehr als nur ein Schnitt. <br/>
            Es ist ein <span className="text-brand italic">Lebensstil.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-md">
            Präzise Schnitte, saubere Fades und zeitloser Stil – kreiert von Profis, denen Ihr Aussehen wichtig ist.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="bg-brand hover:bg-brand-hover text-black font-semibold px-8 py-4 flex items-center justify-center gap-2 transition-colors uppercase text-sm">
              Termin Buchen <Calendar size={18} />
            </button>
            <button className="border border-white hover:border-brand hover:text-brand text-white font-semibold px-8 py-4 transition-colors uppercase text-sm">
              Leistungen ansehen
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100" alt="Kunde" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" alt="Kunde" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" alt="Kunde" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" alt="Kunde" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
            </div>
            <div>
              <div className="flex items-center text-brand">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-sm text-gray-300 mt-1"><span className="text-white font-bold">4.9</span> (500+ Bewertungen)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
