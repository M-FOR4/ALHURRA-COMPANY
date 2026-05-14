import { Target, Compass, Award, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
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
          <span className="text-alhurra-orange font-bold uppercase tracking-[0.25em] text-sm mb-4 block">Identity</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            About Alhurra Company
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Leading the logistics landscape in the Misrata Free Zone since our inception.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Company Overview - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
            <Image 
              src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg" 
              alt="Logistics Facility" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-alhurra-blue/20"></div>
          </div>
          
          <div>
            <h2 className="text-4xl font-extrabold text-alhurra-blue mb-8 tracking-tight">Operational Excellence at the Gateway of Commerce</h2>
            <div className="space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed">
                Alhurra Company for Shipping, Unloading and Storage L.L.C is a premier logistics company operating within the
                Misrata Free Zone, one of Libya's most strategically significant trade and industrial hubs.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Positioned at the gateway of Libyan commerce, our facility benefits from direct proximity to the Port of Misrata —
                Libya's largest seaport — enabling seamless cargo transit for importers, exporters, manufacturers, and
                distributors.
              </p>
              <div className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="bg-orange-100 p-3 rounded-xl h-fit">
                  <CheckCircle2 className="w-6 h-6 text-alhurra-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Certified & Trusted</h4>
                  <p className="text-sm text-slate-500">Fully authorized logistics provider within the MFZ regulatory framework.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision, Mission, Values */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
              <Compass className="w-8 h-8 text-alhurra-blue" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Our Vision</h2>
            <p className="text-slate-500 leading-relaxed">
              To be the leading logistics and free zone service provider in Libya, setting the benchmark for quality, reliability, and innovation.
            </p>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-alhurra-orange/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="bg-alhurra-orange/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-alhurra-orange" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed">
                To provide world-class shipping, unloading and storage services that empower businesses to thrive in competitive markets.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
              <Award className="w-8 h-8 text-alhurra-blue" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Our Values</h2>
            <ul className="space-y-3">
              {[
                "Integrity", "Reliability", "Safety", "Efficiency", "Customer Focus", "Continuous Improvement"
              ].map((value) => (
                <li key={value} className="flex items-center gap-3 text-slate-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-alhurra-orange"></div>
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
