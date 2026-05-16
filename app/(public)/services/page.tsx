import { supabase } from "@/lib/supabase";
import {
  PackageOpen, Warehouse, Boxes, Move, FileText, ClipboardCheck,
  Building, ThermometerSnowflake, Truck, Key, Laptop, Globe,
  Anchor, ShieldCheck, LucideIcon, ChevronRight, ArrowRight,
  CheckCircle2, Star, Zap, Clock, Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Icon Map ─────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  PackageOpen, Warehouse, Boxes, Move, FileText, ClipboardCheck,
  Building, ThermometerSnowflake, Truck, Key, Laptop, Globe,
  Anchor, ShieldCheck,
};

// ─── Fallback stock images per service index ──────────────
const FALLBACK_IMAGES = [
  "https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/4481258/pexels-photo-4481258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/4484155/pexels-photo-4484155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const FUTURE_IMAGES = [
  "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export const revalidate = 0; // Force dynamic to see changes instantly during setup

async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order")
    .order("id");
  if (error) { console.error(error); return []; }
  return data;
}

export default async function Services() {
  const services = await getServices();
  const currentServices = services.filter((s) => s.category === "Current");
  const futureServices = services.filter((s) => s.category === "Future");

  return (
    <div className="bg-white min-h-screen">

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Logistics Operations"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/70 to-[#0A1628]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-transparent" />
        </div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px"
        }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-alhurra-orange/20 border border-alhurra-orange/40 text-alhurra-orange text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alhurra-orange opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-alhurra-orange" />
              </span>
              Our Expertise
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tighter">
              World-Class
              <br />
              <span className="text-alhurra-orange">Logistics</span>
              <br />
              Solutions
            </h1>
            <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
              Tailored operations designed for maximum efficiency within the strategic framework of the Misrata Free Zone — connecting Libya to global trade.
            </p>

            <div className="mt-10 flex items-center gap-8">
              {[
                { icon: Shield, label: "MFZ Certified" },
                { icon: Clock, label: "24/7 Operations" },
                { icon: Zap, label: "Fast Clearance" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/70">
                  <item.icon className="w-4 h-4 text-alhurra-orange" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
      </section>

      {/* ══════════════════════════════════════════════════════
          CURRENT SERVICES — Alternating Layout
      ══════════════════════════════════════════════════════ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-20">
            <div>
              <span className="text-alhurra-orange font-extrabold uppercase tracking-[0.25em] text-xs">Active Operations</span>
              <h2 className="text-4xl md:text-5xl font-black text-alhurra-blue mt-2 tracking-tight">
                What We Do Today
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent ml-8" />
            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-200">
              ✓ Available Now
            </span>
          </div>

          {/* Alternating Service Blocks */}
          {currentServices.length > 0 ? (
            <div className="space-y-0">
              {currentServices.map((service, idx) => {
                const Icon = iconMap[service.icon_name] || PackageOpen;
                const imgSrc = service.image_url || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                const isEven = idx % 2 === 0;

                return (
                  <div key={service.id}
                    className={`group grid lg:grid-cols-2 gap-0 items-stretch rounded-none border-b border-slate-100 last:border-0 ${idx === 0 ? "rounded-t-[3rem] overflow-hidden" : ""} ${idx === currentServices.length - 1 ? "rounded-b-[3rem] overflow-hidden" : ""}`}>

                    {/* Image Block */}
                    <div className={`relative h-[300px] lg:h-[420px] overflow-hidden order-1 ${isEven ? "lg:order-1" : "lg:order-2"}`} >
                      <Image src={imgSrc} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      {/* dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-alhurra-blue/30 to-transparent group-hover:from-alhurra-blue/10 transition-all duration-500" />
                      {/* Icon floating badge */}
                      <div className="absolute top-6 left-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                        <Icon className="w-7 h-7 text-alhurra-blue" />
                      </div>
                      {/* Number */}
                      <div className="absolute bottom-6 right-6 text-6xl lg:text-8xl font-black text-white/20 select-none leading-none">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {/* Text Block */}
                    <div className={`relative flex flex-col justify-center p-8 lg:p-16 bg-white order-2 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                      {/* Subtle side accent */}
                      <div className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-alhurra-orange to-alhurra-blue/20 hidden lg:block ${isEven ? "left-0" : "right-0"}`} />

                      {service.subtitle && (
                        <span className="text-alhurra-orange font-extrabold uppercase tracking-[0.2em] text-xs mb-4 block">
                          {service.subtitle}
                        </span>
                      )}
                      <h3 className="text-3xl md:text-4xl font-black text-alhurra-blue mb-5 tracking-tight leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                        {service.description || "Comprehensive logistics service designed for the Misrata Free Zone environment."}
                      </p>

                      {/* Feature bullets */}
                      <div className="space-y-2 mb-8">
                        {["MFZ Certified & Compliant", "Real-time Tracking", "Licensed Operations"].map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle2 className="w-4 h-4 text-alhurra-orange flex-shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>

                      <Link href="/contact"
                        className="inline-flex items-center gap-2 text-alhurra-blue font-black text-sm uppercase tracking-widest group/link hover:text-alhurra-orange transition-colors">
                        Request This Service
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 rounded-3xl border-2 border-dashed border-slate-200">
              <PackageOpen className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-400">لا توجد خدمات متاحة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS DIVIDER
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-alhurra-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "100%", label: "MFZ Compliance" },
              { value: "24/7", label: "Operations" },
              { value: "5+", label: "Active Services" },
              { value: "Fast", label: "Customs Clearance" },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-4xl md:text-5xl font-black text-alhurra-orange mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm font-semibold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FUTURE EXPANSION — Mosaic/Magazine Layout
      ══════════════════════════════════════════════════════ */}
      {futureServices.length > 0 && (
        <section className="py-28 bg-[#06101E] relative overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(255,165,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,0,0.05) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }} />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-alhurra-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-alhurra-blue/20 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-16">
              <div>
                <span className="text-alhurra-orange/70 font-extrabold uppercase tracking-[0.25em] text-xs">Horizon</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mt-2 tracking-tight">
                  Future Expansion
                </h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-8" />
              <span className="bg-alhurra-orange/20 text-alhurra-orange px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-alhurra-orange/30">
                Coming Soon
              </span>
            </div>

            {/* Magazine Grid */}
            <div className={`grid gap-6 ${futureServices.length >= 3 ? "md:grid-cols-3" : futureServices.length === 2 ? "md:grid-cols-2" : "grid-cols-1"}`}>
              {futureServices.map((service, idx) => {
                const Icon = iconMap[service.icon_name] || Laptop;
                const imgSrc = service.image_url || FUTURE_IMAGES[idx % FUTURE_IMAGES.length];
                const isFeatured = service.featured || idx === 0;

                return (
                  <div key={service.id}
                    className={`group relative rounded-3xl overflow-hidden cursor-default ${isFeatured && idx === 0 && futureServices.length >= 3 ? "md:col-span-2 md:row-span-1" : ""}`}
                    style={{ minHeight: isFeatured && idx === 0 ? "420px" : "300px" }}>

                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image src={imgSrc} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 saturate-50 group-hover:saturate-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-8" style={{ minHeight: "inherit" }}>
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-alhurra-orange/20 border border-alhurra-orange/30 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-6 h-6 text-alhurra-orange" />
                        </div>
                        <span className="text-[10px] font-black text-alhurra-orange/80 uppercase tracking-[0.2em] bg-alhurra-orange/10 border border-alhurra-orange/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          Coming Soon
                        </span>
                      </div>

                      {/* Bottom text */}
                      <div>
                        {service.subtitle && (
                          <p className="text-alhurra-orange/80 text-xs font-bold uppercase tracking-widest mb-2">{service.subtitle}</p>
                        )}
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{service.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed line-clamp-3">{service.description}</p>

                        {/* Progress bar (decorative) */}
                        <div className="mt-5">
                          <div className="flex items-center justify-between text-[10px] text-white/40 mb-1.5">
                            <span>Development Progress</span>
                            <span>{30 + idx * 20}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-alhurra-orange to-amber-400 rounded-full"
                              style={{ width: `${30 + idx * 20}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(230,100,30,0.06),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="text-alhurra-orange font-extrabold uppercase tracking-[0.25em] text-xs mb-4 block">Get Started</span>
          <h2 className="text-5xl font-black text-alhurra-blue mb-6 tracking-tight">
            Ready to Move
            <br />
            <span className="text-alhurra-orange">Your Cargo Forward?</span>
          </h2>
          <p className="text-gray-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Our specialists are ready to design a custom logistics solution tailored to your business needs within the Misrata Free Zone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-alhurra-blue text-white font-bold rounded-2xl hover:bg-alhurra-blue/90 hover:scale-105 transition-all shadow-xl shadow-alhurra-blue/20">
              Contact Our Team <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/operations-log"
              className="inline-flex items-center gap-2 px-10 py-4 border-2 border-slate-200 text-alhurra-blue font-bold rounded-2xl hover:border-alhurra-blue transition-all">
              View Active Operations <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
