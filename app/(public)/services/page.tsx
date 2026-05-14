import { supabase } from "@/lib/supabase";
import { PackageOpen, Warehouse, Boxes, Move, FileText, ClipboardCheck, Building, ThermometerSnowflake, Truck, Key, Laptop, Globe, LucideIcon, ChevronRight } from "lucide-react";
import Image from "next/image";

// Map string icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  PackageOpen,
  Warehouse,
  Boxes,
  Move,
  FileText,
  ClipboardCheck,
  Building,
  ThermometerSnowflake,
  Truck,
  Key,
  Laptop,
  Globe,
};

export const revalidate = 60; // Revalidate every minute

async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("id");
  
  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  return data;
}

export default async function Services() {
  const services = await getServices();
  
  const currentServices = services.filter((s) => s.category === "Current");
  const futureServices = services.filter((s) => s.category === "Future");

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 bg-alhurra-blue overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <Image 
             src="https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg" 
             alt="Background" 
             fill 
             className="object-cover"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-alhurra-blue/80 to-alhurra-blue"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-alhurra-orange font-bold uppercase tracking-[0.25em] text-sm mb-4 block">Our Expertise</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Logistics Solutions & Services
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Tailored operations designed for efficiency within the strategic framework of the Misrata Free Zone.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Current Services */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-extrabold text-alhurra-blue tracking-tight">Active Operations</h2>
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Available Now</span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentServices.length > 0 ? currentServices.map((service) => {
              const Icon = iconMap[service.icon_name] || PackageOpen;
              return (
                <div key={service.id} className="group bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-alhurra-blue transition-colors duration-300">
                    <Icon className="w-8 h-8 text-alhurra-blue group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">{service.description}</p>
                  <div className="h-px bg-slate-100 w-full mb-6"></div>
                  <div className="flex items-center text-alhurra-orange font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Authorized MFZ Service <ChevronRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400">Services list is being updated...</p>
              </div>
            )}
          </div>
        </div>

        {/* Future Expansion Plans */}
        <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-alhurra-orange/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Future Expansion</h2>
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="bg-alhurra-orange/20 text-alhurra-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Coming Soon</span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {futureServices.length > 0 ? futureServices.map((service) => {
                const Icon = iconMap[service.icon_name] || Laptop;
                return (
                  <div key={service.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="bg-alhurra-orange/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                      <Icon className="w-8 h-8 text-alhurra-orange" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{service.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{service.description}</p>
                  </div>
                );
              }) : (
                <div className="col-span-full text-center py-12 text-slate-500">
                  Expansion plans in progress...
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
