import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white pt-16 pb-8 border-t-[3px] border-brand">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-brand flex items-center justify-center p-1">
                <div className="border border-brand w-full h-full flex items-center justify-center text-brand font-serif text-xl">L</div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lg tracking-wider uppercase font-bold text-white">Legend</span>
                <span className="text-[9px] text-brand tracking-[0.2em] uppercase">Barber Shop</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Präzise Schnitte. Premium-Service. Zeitloser Stil.
            </p>
            <div className="flex gap-4">
              <Instagram size={16} className="text-gray-400 hover:text-brand cursor-pointer transition-colors" />
              <Facebook size={16} className="text-gray-400 hover:text-brand cursor-pointer transition-colors" />
              <Twitter size={16} className="text-gray-400 hover:text-brand cursor-pointer transition-colors" />
              <Youtube size={16} className="text-gray-400 hover:text-brand cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm mb-5 font-serif uppercase tracking-widest text-white">Schnelllinks</h4>
            <ul className="space-y-3 text-gray-400 text-xs">
              <li><a href="#" className="hover:text-brand transition-colors">Über Uns</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Leistungen</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Barbiere</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Galerie</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Preise</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Kontakt</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm mb-5 font-serif uppercase tracking-widest text-white">Leistungen</h4>
            <ul className="space-y-3 text-gray-400 text-xs">
              <li><a href="#" className="hover:text-brand transition-colors">Haarschnitt</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Bartpflege</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Nassrasur</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Kinderhaarschnitt</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Haar-Design</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Haarwäsche</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold text-sm mb-5 font-serif uppercase tracking-widest text-white">Kontakt</h4>
            <ul className="space-y-4 text-gray-400 text-xs">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-brand shrink-0 mt-0.5" />
                <span>123 Barber Street,<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-brand shrink-0" />
                <span>(212) 555-0198</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-brand shrink-0" />
                <span>info@legendbarbershop.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={14} className="text-brand shrink-0" />
                <span>Mo - So: 9 - 20 Uhr</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-sm mb-5 font-serif uppercase tracking-widest text-white">Newsletter</h4>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">Abonnieren Sie, um Updates & exklusive Angebote zu erhalten.</p>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Ihre E-Mail-Adresse" 
                className="bg-[#1a1a1a] border border-gray-800 text-white px-4 py-2.5 text-xs focus:outline-none focus:border-brand w-full"
              />
              <button className="bg-brand hover:bg-brand-hover text-black font-semibold py-2.5 text-xs transition-colors uppercase w-full">
                Abonnieren
              </button>
            </div>
          </div>
          
        </div>

        <div className="pt-6 border-t border-gray-800 text-center flex flex-col md:flex-row justify-center items-center">
          <p className="text-gray-500 text-xs">© 2024 Legend Barber Shop. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
