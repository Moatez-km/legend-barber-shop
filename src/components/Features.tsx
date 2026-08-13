import { Scissors, BadgeCheck, Sparkles, Star } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Scissors className="w-8 h-8 text-brand" />,
      title: "ERFAHRENE BARBIERE",
      desc: "Qualifizierte & erfahrene Profis"
    },
    {
      icon: <BadgeCheck className="w-8 h-8 text-brand" />,
      title: "PREMIUM PRODUKTE",
      desc: "Hochwertige Produkte für beste Ergebnisse"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-brand" />,
      title: "SAUBER & HYGIENISCH",
      desc: "Wir halten höchste Hygienestandards ein"
    },
    {
      icon: <Star className="w-8 h-8 text-brand" />,
      title: "ZUFRIEDENHEITSGARANTIE",
      desc: "Ihre Zufriedenheit steht an erster Stelle"
    }
  ];

  return (
    <section className="bg-[#1a1a1a] border-t border-brand/20 py-8 relative z-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4">
              <div className="shrink-0">{feat.icon}</div>
              <div>
                <h3 className="text-brand font-semibold text-sm mb-1">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-snug">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
