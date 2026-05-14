import Link from "next/link";
import { ArrowRight, MapPin, Mail } from "lucide-react";

export default function NextStepsCTA() {
  return (
    <section className="py-12 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="bg-slate-900 rounded-2xl shadow-xl px-6 py-12 md:px-12 md:py-16 border border-white/5 relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-alhurra-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-alhurra-orange/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Location stamp */}
            <div className="inline-flex items-center justify-center gap-2 text-alhurra-orange text-xs font-bold uppercase tracking-[0.2em] mb-6 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
              <MapPin className="w-3 h-3" />
              <span>Misrata Free Zone Operations</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Ready to Optimize Your Supply Chain?
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Partner with Alhurra for professional unloading, specialized storage, and 
              strategic customs coordination at Libya's premier trade hub.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 orange-gradient text-white font-bold px-8 py-3.5 rounded-xl hover:scale-105 transition-all shadow-lg shadow-alhurra-orange/20"
              >
                Inquire Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm"
              >
                Our Services
              </Link>
            </div>

            {/* Quick Contact line */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
              <a href="mailto:info@alhurralogistics.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-alhurra-orange" /> info@alhurralogistics.com
              </a>
              <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-alhurra-orange" /> Misrata Free Zone, Libya
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
