"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Save, AlertCircle, CheckCircle, RefreshCcw } from "lucide-react";

interface ContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  mfz_url: string;
  working_hours: string;
}

export default function AdminSettingsPage() {
  const supabase = createSupabaseBrowser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactSettings>({
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    mfz_url: "",
    working_hours: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Row doesn't exist, we'll create it on first save
          console.log("No settings found, will create on save.");
        } else {
          throw error;
        }
      }

      if (data) {
        setFormData({
          email: data.email || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          location: data.location || "",
          mfz_url: data.mfz_url || "",
          working_hours: data.working_hours || "",
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from("contact_settings")
        .upsert({
          id: 1,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSuccess("Settings updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCcw className="w-8 h-8 animate-spin text-alhurra-blue" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-500 mt-1">Manage contact information and external links</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-alhurra-blue">Contact Information</h2>
        </div>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Business Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent outline-none transition-all"
                  placeholder="info@alhurralogistics.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent outline-none transition-all"
                  placeholder="+218 91 000 0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent outline-none transition-all"
                  placeholder="+218 91 000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">MFZ Website URL</label>
                <input
                  type="url"
                  name="mfz_url"
                  value={formData.mfz_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent outline-none transition-all"
                  placeholder="https://mfz.ly/"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Location / Address</label>
              <textarea
                name="location"
                value={formData.location}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent outline-none transition-all resize-none"
                placeholder="Misrata Free Zone (MFZ), Misrata, Libya"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Working Hours</label>
              <input
                type="text"
                name="working_hours"
                value={formData.working_hours}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-alhurra-orange focus:border-transparent outline-none transition-all"
                placeholder="Sun - Thu: 8:00 AM - 5:00 PM"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="h-14 px-10 rounded-xl orange-gradient border-none font-bold shadow-lg shadow-alhurra-orange/20"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? "Saving Changes..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
