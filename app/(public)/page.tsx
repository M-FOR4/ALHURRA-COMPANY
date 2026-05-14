import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Map, Anchor, ArrowRight, ChevronRight, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─── Fallback images per index ─────────────────────────────
const FALLBACK_IMGS = [
  "https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4481258/pexels-photo-4481258.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4484155/pexels-photo-4484155.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=800",
];

async function getFeaturedServices() {
  const { data } = await supabase
    .from("services")
    .select("id, title, subtitle, description, image_url, slug, featured, sort_order")
    .eq("category", "Current")
    .order("sort_order")
    .limit(6);
  return data ?? [];
}

export const revalidate = 0; // Force dynamic to see changes instantly

export default async function Home() {
  const featuredServices = await getFeaturedServices();

  return (
    <div className="relative">
      {/* ══ HERO SECTION ══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline
            className="w-full h-full object-cover scale-105"
            poster="https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
            <source src="https://player.vimeo.com/external/494252666.hd.mp4?s=2f6979a0060022a45e31caec9a05844410665313&profile_id=175" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-alhurra-blue/80 via-alhurra-blue/40 to-alhurra-blue/90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-alhurra-blue/60 to-transparent z-10" />
        </div>

        <div className="relative z-20 text-center md:text-left px-4 max-w-7xl mx-auto w-full pt-10 md:pt-8">
          <div className="max-w-4xl animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alhurra-orange/20 border border-alhurra-orange/30 text-alhurra-orange text-xs font-bold uppercase tracking-widest mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alhurra-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-alhurra-orange" />
              </span>
              Misrata Free Zone Operations
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-[1.1] tracking-tighter">
              Global Logistics <br />
              <span className="text-alhurra-orange">Redefined.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-200 mb-6 max-w-2xl leading-relaxed font-medium">
              Premier shipping, container handling, and state-of-the-art storage solutions at the heart of the Mediterranean trade routes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg orange-gradient hover:scale-105 transition-transform rounded-xl border-none shadow-xl shadow-alhurra-orange/20">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/operations-log">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg glass-dark text-white border-white/20 hover:bg-white hover:text-alhurra-blue rounded-xl transition-all">
                  View Live Logs
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-8 text-white/60">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">24/7</span>
                <span className="text-[10px] uppercase tracking-widest font-bold">Secure Access</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="text-[10px] uppercase tracking-widest font-bold">MFZ Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STRATEGIC ADVANTAGES ══ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10 skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-alhurra-orange font-bold uppercase tracking-[0.2em] text-sm">Strategic Hub</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-alhurra-blue mt-4 mb-8 tracking-tight">
                Why the Misrata <br /> Free Zone?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-xl">
                Operating in the Misrata Free Zone gives your business a competitive edge with unparalleled customs advantages and geographical proximity to global markets.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Map, title: "Strategic Mediterranean Coast", desc: "Prime location connecting Europe, Africa, and the Middle East." },
                  { icon: ShieldCheck, title: "Tax & Customs Incentives", desc: "Enjoy duty-free operations and simplified regulatory frameworks." },
                  { icon: Anchor, title: "Libya's Premier Port Access", desc: "Direct connectivity to the Port of Misrata for rapid throughput." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-alhurra-blue group-hover:text-white transition-all duration-300">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-alhurra-blue mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Logistics Operations" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-alhurra-blue/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-alhurra-orange flex items-center justify-center text-white">
                      <Play className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-alhurra-blue font-bold">Watch Our Operations</p>
                      <p className="text-alhurra-blue/60 text-xs">A tour through our MFZ facilities</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-alhurra-orange/10 rounded-full blur-2xl -z-10" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-alhurra-blue/10 rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES MOSAIC SECTION ══ */}
      <section className="py-28 bg-[#06101E] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "64px 64px"
        }} />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-alhurra-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-alhurra-blue/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <span className="text-alhurra-orange/80 font-extrabold uppercase tracking-[0.25em] text-xs block mb-3">Capabilities</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Our Core Logistics
                <br />
                <span className="text-alhurra-orange">Solutions</span>
              </h2>
            </div>
            <Link href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-semibold rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all text-sm">
              View Full Service Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mosaic Grid */}
          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
              {featuredServices.map((service, idx) => {
                const imgSrc = service.image_url || FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
                const isFeaturedTall = idx === 0;
                const isWideMid = idx === 3;

                return (
                  <Link key={service.id} href="/services"
                    className={`group relative rounded-3xl overflow-hidden cursor-pointer
                      ${isFeaturedTall ? "row-span-2" : ""}
                      ${isWideMid ? "md:col-span-2" : ""}
                    `}>
                    <img src={imgSrc} alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 saturate-75 group-hover:saturate-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-alhurra-blue/80 group-hover:via-alhurra-blue/30 transition-all duration-500" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black text-white bg-alhurra-orange/80 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">
                        View Service
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {service.subtitle && (
                        <p className="text-alhurra-orange text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {service.subtitle}
                        </p>
                      )}
                      <h3 className={`font-black text-white tracking-tight leading-tight mb-1 ${isFeaturedTall ? "text-2xl md:text-3xl" : "text-lg"}`}>
                        {service.title}
                      </h3>
                      {isFeaturedTall && service.description && (
                        <p className="text-white/60 text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-alhurra-orange text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Learn More <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
              {[
                { title: "Container Unloading", subtitle: "Port Operations", img: FALLBACK_IMGS[0], tall: true },
                { title: "Advanced Storage", subtitle: "Warehousing", img: FALLBACK_IMGS[1], tall: false },
                { title: "Customs Solutions", subtitle: "MFZ Clearance", img: FALLBACK_IMGS[2], tall: false },
              ].map((s, idx) => (
                <Link key={idx} href="/services"
                  className={`group relative rounded-3xl overflow-hidden ${s.tall ? "row-span-2" : ""}`}>
                  <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-alhurra-orange text-[10px] font-black uppercase tracking-widest mb-1">{s.subtitle}</p>
                    <h3 className={`font-black text-white ${s.tall ? "text-2xl" : "text-lg"}`}>{s.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ CALL TO ACTION ══ */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-alhurra-blue relative overflow-hidden p-12 md:p-24 text-center">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" className="w-full h-full object-cover" alt="Background" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">Ready to Optimize Your Logistics Chain?</h2>
            <p className="text-white/70 text-lg mb-12">Join hundreds of companies leveraging our strategic position in the Misrata Free Zone.</p>
            <Link href="/contact">
              <Button size="lg" className="h-16 px-12 text-lg orange-gradient rounded-2xl border-none shadow-2xl shadow-alhurra-orange/40 hover:scale-105 transition-transform">
                Contact Our Specialists
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
