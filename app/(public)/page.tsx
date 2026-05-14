import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Map, Anchor, ArrowRight, CheckCircle2, ChevronRight, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Container */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover scale-105"
            poster="https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          >
            <source src="https://player.vimeo.com/external/494252666.hd.mp4?s=2f6979a0060022a45e31caec9a05844410665313&profile_id=175" type="video/mp4" />
          </video>
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-alhurra-blue/80 via-alhurra-blue/40 to-alhurra-blue/90 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-alhurra-blue/60 to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center md:text-left px-4 max-w-7xl mx-auto w-full pt-28 md:pt-36">
          <div className="max-w-4xl animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alhurra-orange/20 border border-alhurra-orange/30 text-alhurra-orange text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alhurra-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-alhurra-orange"></span>
              </span>
              Misrata Free Zone Operations
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tighter">
              Global Logistics <br />
              <span className="text-alhurra-orange">Redefined.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed font-medium">
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
            
            <div className="mt-12 flex items-center gap-8 text-white/60">
               <div className="flex flex-col">
                 <span className="text-2xl font-bold text-white">24/7</span>
                 <span className="text-[10px] uppercase tracking-widest font-bold">Secure Access</span>
               </div>
               <div className="w-px h-10 bg-white/20"></div>
               <div className="flex flex-col">
                 <span className="text-2xl font-bold text-white">100%</span>
                 <span className="text-[10px] uppercase tracking-widest font-bold">MFZ Compliant</span>
               </div>
            </div>
          </div>
        </div>
        

      </section>

      {/* Strategic Advantages Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10 skew-x-12 translate-x-1/2"></div>
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
                  alt="Logistics Operations" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-alhurra-blue/60 to-transparent"></div>
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
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-alhurra-orange/10 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-alhurra-blue/10 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-alhurra-orange font-bold uppercase tracking-[0.2em] text-sm">Capabilities</span>
              <h2 className="text-4xl font-extrabold text-alhurra-blue mt-4 tracking-tight">Our Core Logistics Solutions</h2>
            </div>
            <Link href="/services">
              <Button variant="outline" className="h-12 px-8 rounded-xl border-slate-200 hover:bg-alhurra-blue hover:text-white transition-all font-bold">
                View Service Catalog
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Container Unloading", 
                desc: "High-speed unloading of 20ft & 40ft containers with industrial precision.",
                img: "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=800"
              },
              { 
                title: "Advanced Storage", 
                desc: "Temperature controlled and bonded warehousing inside the Free Zone.",
                img: "https://images.pexels.com/photos/4481258/pexels-photo-4481258.jpeg?auto=compress&cs=tinysrgb&w=800"
              },
              { 
                title: "Customs Solutions", 
                desc: "Direct integration with MFZ customs for expedited cargo release.",
                img: "https://images.pexels.com/photos/4484155/pexels-photo-4484155.jpeg?auto=compress&cs=tinysrgb&w=800"
              }
            ].map((service, idx) => (
              <div key={idx} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-alhurra-blue/20 group-hover:bg-alhurra-blue/10 transition-colors"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-alhurra-blue mb-3">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.desc}</p>
                  <Link href="/services" className="inline-flex items-center text-alhurra-orange font-bold text-sm hover:gap-2 transition-all">
                    Service Details <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
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
