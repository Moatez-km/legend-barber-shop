import { MapPin, Phone, Instagram, Facebook, Twitter, Youtube, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0a0a0a] text-gray-400 text-xs py-2 px-4 md:px-8 border-b border-gray-800 flex justify-between items-center hidden md:flex">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><MapPin size={14} className="text-brand" /> 123 Barber Street, New York, NY 10001</span>
          <span className="flex items-center gap-2 text-brand">💈 Ohne Termin willkommen</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><Phone size={14} className="text-brand" /> (212) 555-0198</span>
          <div className="flex items-center gap-3">
            <Instagram size={14} className="hover:text-brand cursor-pointer transition-colors" />
            <Facebook size={14} className="hover:text-brand cursor-pointer transition-colors" />
            <Twitter size={14} className="hover:text-brand cursor-pointer transition-colors" />
            <Youtube size={14} className="hover:text-brand cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#121212] py-4 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="w-10 h-10 border border-brand flex items-center justify-center p-1">
            <div className="border border-brand w-full h-full flex items-center justify-center text-brand font-serif text-xl">L</div>
          </div>
          <div className="flex flex-col text-white leading-tight">
            <span className="font-serif text-xl tracking-wider uppercase font-bold">Legend</span>
            <span className="text-[10px] text-brand tracking-[0.2em] uppercase">Barber Shop</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm text-white font-medium">
          <a href="#" className="text-brand border-b border-brand pb-1">STARTSEITE</a>
          <a href="#" className="hover:text-brand transition-colors">ÜBER UNS</a>
          <a href="#" className="hover:text-brand transition-colors flex items-center gap-1">LEISTUNGEN <span className="text-[10px]">▼</span></a>
          <a href="#" className="hover:text-brand transition-colors">BARBIERE</a>
          <a href="#" className="hover:text-brand transition-colors">GALERIE</a>
          <a href="#" className="hover:text-brand transition-colors">PREISE</a>
          <a href="#" className="hover:text-brand transition-colors">KONTAKT</a>
        </nav>

        <div className="hidden lg:block">
          <a href="#booking-section" className="bg-brand hover:bg-brand-hover text-black font-semibold text-sm px-6 py-3 transition-colors inline-block uppercase text-center">
            TERMIN BUCHEN
          </a>
        </div>

        <button className="lg:hidden text-white">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
