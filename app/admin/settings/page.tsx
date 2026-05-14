"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  Save,
  AlertCircle,
  CheckCircle,
  RefreshCcw,
  UserPlus,
  Trash2,
  Shield,
  Globe,
  Settings as SettingsIcon,
  Users,
  Lock,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  ExternalLink,
} from "lucide-react";

interface ContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  mfz_url: string;
  working_hours: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  meta_title?: string;
  meta_description?: string;
}

interface AdminAccount {
  id: number;
  username: string;
  role: string;
  created_at?: string;
}

export default function AdminSettingsPage() {
  const supabase = createSupabaseBrowser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // General State
  const [formData, setFormData] = useState<ContactSettings>({
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    mfz_url: "",
    working_hours: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    twitter_url: "",
    meta_title: "",
    meta_description: "",
  });

  // User Management State
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "", role: "admin" });
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // Security State
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    await Promise.all([fetchSettings(), fetchAdmins()]);
    setLoading(false);
  }

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setFormData({
          email: data.email || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          location: data.location || "",
          mfz_url: data.mfz_url || "",
          working_hours: data.working_hours || "",
          facebook_url: data.facebook_url || "",
          instagram_url: data.instagram_url || "",
          linkedin_url: data.linkedin_url || "",
          twitter_url: data.twitter_url || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
        });
      }
    } catch (err: any) {
      console.error("Fetch settings error:", err.message);
    }
  }

  async function fetchAdmins() {
    try {
      const { data, error } = await supabase
        .from("admin_accounts")
        .select("id, username, role, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (err: any) {
      console.error("Fetch admins error:", err.message);
    }
  }

  const handleGeneralSave = async () => {
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
      setSuccess("General settings updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("admin_accounts")
        .insert([newAdmin]);

      if (error) throw error;

      setSuccess(`Admin account "${newAdmin.username}" created!`);
      setNewAdmin({ username: "", password: "", role: "admin" });
      setShowAddAdmin(false);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (id: number, username: string) => {
    if (username === "admin") {
      alert("Cannot delete the main admin account!");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${username}?`)) return;

    try {
      const { error } = await supabase
        .from("admin_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSuccess("Admin deleted successfully");
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match");
      return;
    }
    // Implementation for dynamic password change would go here
    // For now, let's just simulate or guide how to do it securely
    alert("Password change functionality requires session-based updates. Please contact the system administrator.");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCcw className="w-10 h-10 animate-spin text-alhurra-blue" />
        <p className="text-slate-500 font-medium animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1">Configure your platform and manage access</p>
        </div>

        <div className="flex items-center gap-2">
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto justify-start h-auto">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" /> Admin Accounts
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Globe className="w-4 h-4" /> Branding & SEO
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* --- GENERAL SETTINGS --- */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-alhurra-blue/10 rounded-xl">
                      <Mail className="w-6 h-6 text-alhurra-blue" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Contact Information</CardTitle>
                      <CardDescription>Public contact details shown on the website</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Business Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                        placeholder="info@alhurralogistics.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                        placeholder="+218 91 000 0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">WhatsApp Number</label>
                      <input
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                        placeholder="+218 91 000 0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Working Hours</label>
                      <input
                        type="text"
                        name="working_hours"
                        value={formData.working_hours}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                        placeholder="Sun - Thu: 8:00 AM - 5:00 PM"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Office Location</label>
                    <textarea
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none resize-none"
                      placeholder="Misrata Free Zone (MFZ), Misrata, Libya"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-alhurra-orange/10 rounded-xl">
                      <MessageCircle className="w-6 h-6 text-alhurra-orange" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Social Media Links</CardTitle>
                      <CardDescription>Direct links to your official social channels</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                        <Globe className="w-4 h-4 text-blue-600" /> Facebook URL
                      </label>
                      <input
                        type="url"
                        name="facebook_url"
                        value={formData.facebook_url}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                        <Globe className="w-4 h-4 text-pink-600" /> Instagram URL
                      </label>
                      <input
                        type="url"
                        name="instagram_url"
                        value={formData.instagram_url}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                        <Globe className="w-4 h-4 text-blue-800" /> LinkedIn URL
                      </label>
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                        <Globe className="w-4 h-4 text-sky-500" /> Twitter URL
                      </label>
                      <input
                        type="url"
                        name="twitter_url"
                        value={formData.twitter_url}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden sticky top-8">
                <CardContent className="p-8">
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
                    <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5" /> Save Changes
                    </h3>
                    <p className="text-sm text-blue-700">Any changes made here will be instantly reflected on the live website.</p>
                  </div>
                  <Button
                    onClick={handleGeneralSave}
                    disabled={saving}
                    className="w-full h-16 text-lg font-bold orange-gradient rounded-2xl shadow-xl shadow-alhurra-orange/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
                  >
                    {saving ? <RefreshCcw className="w-6 h-6 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- USER MANAGEMENT --- */}
        <TabsContent value="users">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Admin Accounts</h2>
              <Button
                onClick={() => setShowAddAdmin(!showAddAdmin)}
                className="rounded-xl flex items-center gap-2 px-6 py-3 bg-alhurra-blue text-white hover:bg-alhurra-blue/90 transition-all border-none h-auto"
              >
                {showAddAdmin ? "Cancel" : <><UserPlus className="w-5 h-5" /> Add New Admin</>}
              </Button>
            </div>

            {showAddAdmin && (
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden animate-in fade-in zoom-in duration-300">
                <CardContent className="p-8">
                  <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Username</label>
                      <input
                        type="text"
                        required
                        value={newAdmin.username}
                        onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange outline-none transition-all"
                        placeholder="john_doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Password</label>
                      <input
                        type="password"
                        required
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Role</label>
                      <select
                        value={newAdmin.role}
                        onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange outline-none transition-all"
                      >
                        <option value="admin">Administrator</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="h-14 orange-gradient rounded-xl font-bold shadow-lg shadow-alhurra-orange/20 border-none"
                    >
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin) => (
                <Card key={admin.id} className="border-none shadow-lg shadow-slate-200/40 rounded-3xl overflow-hidden hover:shadow-xl transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl uppercase">
                          {admin.username.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-alhurra-blue transition-colors">
                            {admin.username}
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 uppercase tracking-tighter">
                            {admin.role}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                        disabled={admin.username === "admin"}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-slate-400 gap-2">
                      <RefreshCcw className="w-3 h-3" />
                      Joined: {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* --- BRANDING & SEO --- */}
        <TabsContent value="branding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-500/10 rounded-xl">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">SEO Metadata</CardTitle>
                      <CardDescription>Controls how your site appears in search engines like Google</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Meta Title Tag</label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                      placeholder="Alhurra Logistics | Premium Marine & Cargo Services"
                    />
                    <p className="text-xs text-slate-400 ml-1">Recommended length: 50-60 characters</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Meta Description</label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none resize-none"
                      placeholder="Description of the company for search results..."
                    />
                    <p className="text-xs text-slate-400 ml-1">Recommended length: 150-160 characters</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-900/10 rounded-xl">
                      <ExternalLink className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Platform Settings</CardTitle>
                      <CardDescription>External integrations and tool configs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">MFZ Official URL</label>
                    <input
                      type="url"
                      name="mfz_url"
                      value={formData.mfz_url}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange transition-all outline-none"
                      placeholder="https://mfz.ly/"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden sticky top-8">
                <CardContent className="p-8">
                  <div className="p-6 bg-green-50 rounded-2xl border border-green-100 mb-6">
                    <h3 className="font-bold text-green-900 flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5" /> SEO Impact
                    </h3>
                    <p className="text-sm text-green-700">Updating these fields helps improve your visibility on Google search results.</p>
                  </div>
                  <Button
                    onClick={handleGeneralSave}
                    disabled={saving}
                    className="w-full h-16 text-lg font-bold orange-gradient rounded-2xl shadow-xl shadow-alhurra-orange/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
                  >
                    {saving ? <RefreshCcw className="w-6 h-6 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                    {saving ? "Updating..." : "Update Brand & SEO"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- SECURITY SETTINGS --- */}
        <TabsContent value="security">
          <div className="max-w-2xl">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-500/10 rounded-xl">
                    <Lock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Change Password</CardTitle>
                    <CardDescription>Update your administrative access credentials</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                    <input
                      type="password"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange outline-none transition-all"
                      placeholder="••••••••"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                      <input
                        type="password"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange outline-none transition-all"
                        placeholder="••••••••"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-alhurra-orange outline-none transition-all"
                        placeholder="••••••••"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full md:w-auto h-14 px-10 text-lg font-bold bg-slate-900 border-none text-white rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
