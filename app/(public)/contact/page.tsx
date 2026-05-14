"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import Image from "next/image";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("contact_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      company_name: formData.get("company_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service_requested: formData.get("service_requested") as string,
      message: formData.get("message") as string,
    };

    const { error } = await supabase.from("contact_inquiries").insert([data]);

    if (!error) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      console.error("Submission error:", error);
      alert("There was an error submitting your request. Please try again.");
    }
    
    setIsSubmitting(false);
  };

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
          <span className="text-alhurra-orange font-bold uppercase tracking-[0.25em] text-sm mb-4 block">Connection</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Partner with the logistics leaders in the Misrata Free Zone.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h2 className="text-2xl font-extrabold text-alhurra-blue mb-8 tracking-tight">Contact Information</h2>
              <div className="space-y-8">
                {[
                  { 
                    icon: MapPin, 
                    title: "Location", 
                    detail: settings?.location || "Misrata Free Zone (MFZ), Misrata, Libya", 
                    href: settings?.mfz_url || "https://mfz.ly/" 
                  },
                  { 
                    icon: Mail, 
                    title: "Email", 
                    detail: settings?.email || "info@alhurralogistics.com", 
                    href: settings?.email ? `mailto:${settings.email}` : "mailto:info@alhurralogistics.com" 
                  },
                  { 
                    icon: Phone, 
                    title: "Phone", 
                    detail: settings?.phone || "+218 91 000 0000", 
                    href: settings?.phone ? `tel:${settings.phone.replace(/\s+/g, '')}` : "tel:+218910000000" 
                  },
                  { 
                    icon: MessageCircle, 
                    title: "WhatsApp", 
                    detail: "Chat on WhatsApp", 
                    href: settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : "https://wa.me/218910000000" 
                  },
                  { 
                    icon: Clock, 
                    title: "Working Hours", 
                    detail: settings?.working_hours || "Sun - Thu: 8:00 AM - 5:00 PM" 
                  },
                ].map((item, i) => {
                  const Content = (
                    <>
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100 text-alhurra-orange group-hover:bg-alhurra-orange group-hover:text-white transition-all duration-300">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</h3>
                        <p className="text-lg font-bold text-alhurra-blue group-hover:text-alhurra-orange transition-colors">
                          {item.detail}
                        </p>
                      </div>
                    </>
                  );

                  return item.href ? (
                    <a 
                      key={i} 
                      href={item.href} 
                      target={item.href.startsWith('http') ? "_blank" : undefined}
                      rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="flex gap-6 group cursor-pointer"
                    >
                      {Content}
                    </a>
                  ) : (
                    <div key={i} className="flex gap-6 group">
                      {Content}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-50 rounded-full -z-10"></div>
              
              {success ? (
                <div className="text-center py-12">
                  <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Message Received!</h3>
                  <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
                    Thank you for your interest. Our logistics team will review your inquiry and contact you shortly.
                  </p>
                  <Button className="h-14 px-10 rounded-2xl orange-gradient border-none font-bold" onClick={() => setSuccess(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-extrabold text-alhurra-blue mb-10 tracking-tight">Send an Inquiry</h2>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="company_name" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Company Name *</label>
                        <input type="text" id="company_name" name="company_name" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent transition-all outline-none" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Business Email *</label>
                        <input type="email" id="email" name="email" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent transition-all outline-none" />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Phone Number</label>
                        <input type="tel" id="phone" name="phone" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent transition-all outline-none" />
                      </div>
                      <div>
                        <label htmlFor="service_requested" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Service of Interest</label>
                        <select id="service_requested" name="service_requested" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent transition-all outline-none appearance-none cursor-pointer">
                          <option value="">Select a service...</option>
                          <option value="Container Handling">Container Handling</option>
                          <option value="Storage Solutions">Storage Solutions</option>
                          <option value="Customs Clearance">Customs Clearance</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-wider">Project Details *</label>
                      <textarea id="message" name="message" rows={5} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent transition-all outline-none resize-none"></textarea>
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full h-16 text-xl font-bold orange-gradient rounded-2xl border-none shadow-xl shadow-alhurra-orange/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
                      {isSubmitting ? "Processing..." : (
                        <span className="flex items-center justify-center gap-2">
                          Submit Inquiry <Send className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
