import { Play } from 'lucide-react';

export default function About() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-[#121212] rounded-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left Image Side */}
          <div className="lg:w-1/2 relative min-h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1508898578281-774ac4893c0c?auto=format&fit=crop&q=80" 
              alt="Barber Shop Interior" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-brand/90 hover:bg-brand rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(210,164,90,0.5)] transition-all transform hover:scale-105">
                <Play fill="currentColor" size={32} className="ml-2" />
              </button>
            </div>
            {/* Overlay Text */}
            <div className="absolute top-8 left-8 hidden sm:block">
              <div className="border border-brand/50 p-4 bg-black/40 backdrop-blur-sm rounded-sm">
                <p className="font-serif text-brand text-2xl uppercase font-bold leading-tight">
                  Legenden<br/>
                  <span className="text-white text-xs uppercase tracking-wide">werden nicht geboren</span><br/>
                  <span className="text-white text-xs uppercase tracking-wide">Sie werden geschnitten</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Text Side */}
          <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <p className="text-brand font-semibold text-sm tracking-widest uppercase mb-4">Über Uns</p>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Präzision. Stil. Selbstvertrauen.</h2>
            <p className="text-gray-400 leading-relaxed mb-10 text-sm">
              Wir im Legend Barber Shop glauben, dass ein großartiger Haarschnitt mehr als nur eine Dienstleistung ist – es ist ein Erlebnis. 
              Unsere Barbiere vereinen Können, Leidenschaft und Liebe zum Detail, um Styles zu kreieren, mit denen Sie bestmöglich aussehen und sich auch so fühlen.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 border-t border-b border-gray-800 py-6">
              <div>
                <p className="text-brand text-3xl font-bold flex items-center gap-1 font-serif">10+</p>
                <p className="text-gray-500 text-[10px] tracking-wide uppercase mt-1">Jahre Erfahrung</p>
              </div>
              <div>
                <p className="text-brand text-3xl font-bold flex items-center gap-1 font-serif">50K+</p>
                <p className="text-gray-500 text-[10px] tracking-wide uppercase mt-1">Zufriedene Kunden</p>
              </div>
              <div>
                <p className="text-brand text-3xl font-bold flex items-center gap-1 font-serif">15+</p>
                <p className="text-gray-500 text-[10px] tracking-wide uppercase mt-1">Erfahrene Barbiere</p>
              </div>
              <div>
                <p className="text-brand text-3xl font-bold flex items-center gap-1 font-serif">4.9</p>
                <p className="text-gray-500 text-[10px] tracking-wide uppercase mt-1">Kundenbewertung</p>
              </div>
            </div>

            <div>
              <button className="bg-brand hover:bg-brand-hover text-black font-semibold px-8 py-3 text-sm transition-colors uppercase rounded-sm">
                Mehr Über Uns
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
