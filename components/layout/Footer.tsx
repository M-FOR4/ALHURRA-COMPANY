"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("contact_settings")
        .select("email, location")
        .eq("id", 1)
        .single();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, [supabase]);

  return (
    <footer className="bg-alhurra-blue text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-wider">ALHURRA</h3>
            <p className="text-gray-300 mb-4">
              "Moving your cargo forward - every container, every time."
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-alhurra-orange">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-alhurra-orange transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-alhurra-orange transition-colors">Services</Link></li>
              <li><Link href="/operations-log" className="hover:text-alhurra-orange transition-colors">Operations Log</Link></li>
              <li><Link href="/contact" className="hover:text-alhurra-orange transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-alhurra-orange">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-alhurra-orange" />
                <span className="whitespace-pre-line">{settings?.location || "Misrata Free Zone\nMisrata, Libya"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-alhurra-orange" />
                <a href={`mailto:${settings?.email || "info@alhurralogistics.com"}`} className="hover:text-alhurra-orange transition-colors">
                  {settings?.email || "info@alhurralogistics.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Alhurra Company for Shipping, Unloading and Storage L.L.C. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
