import { Anchor, ShieldCheck, Clock, Globe, TrendingUp, Building2 } from "lucide-react";

const ADVANTAGES = [
  {
    icon: Anchor,
    title: "Direct Port Access",
    description:
      "Located adjacent to the Port of Misrata — Libya's largest and most active commercial seaport — enabling seamless cargo transit with minimal handling time.",
    highlight: "Libya's #1 Seaport",
  },
  {
    icon: ShieldCheck,
    title: "Customs Advantages",
    description:
      "Free Zone operations allow for duty-free import/export and streamlined customs clearance for eligible goods, reducing costs and delays for international clients.",
    highlight: "Duty-Free Operations",
  },
  {
    icon: Clock,
    title: "24/7 Secure Infrastructure",
    description:
      "Modern facilities with round-the-clock security monitoring, ensuring the complete safety of all goods, containers, and assets at all times.",
    highlight: "Always On",
  },
  {
    icon: Globe,
    title: "Mediterranean Trade Hub",
    description:
      "Strategically positioned on the Mediterranean coast with direct access to European, Middle Eastern, and African trade routes.",
    highlight: "3 Continents",
  },
  {
    icon: TrendingUp,
    title: "Business-Friendly Regulations",
    description:
      "Simplified licensing, reduced bureaucracy, and investor-friendly policies under the Misrata Free Zone authority accelerate market entry.",
    highlight: "MFZ Authority",
  },
  {
    icon: Building2,
    title: "Full-Scope Logistics",
    description:
      "From container unloading and storage to customs coordination and inspection — a single operator covers your entire logistics chain in the Free Zone.",
    highlight: "End-to-End",
  },
];

export default function WhyPartnerSection() {
  return (
    <section className="py-24 bg-alhurra-blue relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-alhurra-orange/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-alhurra-orange text-xs font-bold uppercase tracking-[0.25em] mb-4 block">
            Strategic Advantages
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Why Partner with Alhurra?
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
            Every container we handle represents a commitment — to our clients,
            to quality, and to Libya's growing role in global trade.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVANTAGES.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2.5rem] p-10 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="bg-alhurra-orange/20 rounded-2xl p-4 group-hover:bg-alhurra-orange transition-colors duration-300">
                    <Icon className="w-6 h-6 text-alhurra-orange group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-[10px] font-extrabold text-alhurra-orange bg-alhurra-orange/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-alhurra-orange/20">
                    {adv.highlight}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                  {adv.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stat bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-[2.5rem] overflow-hidden border border-white/10">
          {[
            { stat: "20ft – 40ft", label: "Container Handling" },
            { stat: "MFZ", label: "Free Zone Certified" },
            { stat: "24/7", label: "Security & Monitoring" },
            { stat: "3+", label: "Continents Reach" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 px-8 py-10 text-center hover:bg-white/10 transition-colors"
            >
              <p className="text-3xl font-black text-white mb-2">
                {item.stat}
              </p>
              <p className="text-xs font-bold text-alhurra-orange uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
