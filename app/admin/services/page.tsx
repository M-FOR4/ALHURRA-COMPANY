"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";
import {
  Plus, Save, X, Edit, Trash2, AlertCircle, CheckCircle,
  PackageOpen, Warehouse, Boxes, Move, FileText, ClipboardCheck,
  Building, ThermometerSnowflake, Truck, Key, Laptop, Globe,
  Anchor, ShieldCheck, Star, GripVertical, ImageIcon,
  Upload, Link2, Loader2,
} from "lucide-react";

// ─── Icon Registry ───────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  PackageOpen, Warehouse, Boxes, Move, FileText, ClipboardCheck,
  Building, ThermometerSnowflake, Truck, Key, Laptop, Globe,
  Anchor, ShieldCheck,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);
const CATEGORIES = ["Current", "Future"];

// ─── Types ───────────────────────────────────────────────────
interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  icon_name: string;
  slug: string;
  image_url: string;
  sort_order: number;
  featured: boolean;
}

const emptyService: Omit<Service, "id"> = {
  title: "",
  subtitle: "",
  description: "",
  category: "Current",
  icon_name: "PackageOpen",
  slug: "",
  image_url: "",
  sort_order: 0,
  featured: false,
};

function generateSlug(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Image Input Component ────────────────────────────────────
function ImageInput({
  value,
  onChange,
  supabase,
}: {
  value: string;
  onChange: (url: string) => void;
  supabase: ReturnType<typeof createSupabaseBrowser>;
}) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset preview error when value changes
  useEffect(() => { setPreviewError(false); }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type & size
    if (!file.type.startsWith("image/")) {
      setUploadError("يرجى اختيار ملف صورة فقط (JPG, PNG, WebP, ...)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("حجم الملف يجب أن يكون أقل من 5MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `services/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("assets")
        .upload(fileName, file, { upsert: false, contentType: file.type });

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from("assets").getPublicUrl(fileName);
      onChange(data.publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل رفع الصورة";
      // If bucket doesn't exist, give clear message
      if (msg.includes("bucket") || msg.includes("not found")) {
        setUploadError("تأكد من إنشاء bucket اسمه 'assets' في Supabase Storage وجعله public");
      } else {
        setUploadError(msg);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "upload" ? "bg-white text-alhurra-blue shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          <Upload className="w-3.5 h-3.5" /> رفع ملف
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "url" ? "bg-white text-alhurra-blue shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          <Link2 className="w-3.5 h-3.5" /> رابط URL
        </button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <div>
          <label
            className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all
              ${uploading ? "border-alhurra-blue/40 bg-alhurra-blue/5" : "border-gray-200 bg-gray-50 hover:border-alhurra-blue/50 hover:bg-alhurra-blue/5"}`}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading ? (
              <div className="text-center">
                <Loader2 className="w-8 h-8 mx-auto text-alhurra-blue animate-spin mb-2" />
                <p className="text-sm text-alhurra-blue font-semibold">جاري الرفع...</p>
              </div>
            ) : (
              <div className="text-center px-4">
                <Upload className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500 font-medium">
                  اسحب الصورة هنا أو <span className="text-alhurra-blue font-bold">اختر ملف</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WebP — حد أقصى 5MB</p>
              </div>
            )}
          </label>
          {uploadError && (
            <div className="flex items-start gap-2 mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-alhurra-blue/40 focus:border-alhurra-blue outline-none transition-all text-sm"
          placeholder="https://images.pexels.com/..."
        />
      )}

      {/* Preview */}
      {value && (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
          {!previewError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value} alt="Preview"
                onError={() => setPreviewError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[10px] text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg truncate max-w-[80%]">
                  {value.length > 50 ? value.slice(0, 50) + "…" : value}
                </span>
                <button type="button" onClick={() => onChange("")}
                  className="p-1 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs text-red-500 font-medium">⚠️ تعذر تحميل الصورة من هذا الرابط</p>
              <button type="button" onClick={() => onChange("")}
                className="mt-2 text-xs text-gray-500 underline">إزالة</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function AdminServicesPage() {
  const supabase = createSupabaseBrowser();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Service, "id">>(emptyService);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [generating, setGenerating] = useState(true);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services").select("*").order("sort_order").order("title");
    if (!error && data) setServices(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const setField = <K extends keyof Omit<Service, "id">>(k: K, v: Omit<Service, "id">[K]) =>
    setFormData(prev => ({ ...prev, [k]: v }));

  const handleTitleChange = (v: string) =>
    setFormData(prev => ({ ...prev, title: v, slug: generating ? generateSlug(v) : prev.slug }));

  const startEdit = (s: Service) => {
    setEditing(s); setCreating(false);
    setFormData({
      title: s.title, subtitle: s.subtitle || "", description: s.description,
      category: s.category, icon_name: s.icon_name, slug: s.slug,
      image_url: s.image_url || "", sort_order: s.sort_order || 0, featured: s.featured || false,
    });
    setError(null); setSuccess(null); setGenerating(false);
  };

  const startCreate = () => {
    setCreating(true); setEditing(null); setFormData(emptyService);
    setError(null); setSuccess(null); setGenerating(true);
  };

  const cancelForm = () => {
    setCreating(false); setEditing(null); setFormData(emptyService); setError(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) { setError("العنوان مطلوب."); return; }
    if (!formData.slug.trim()) { setError("الـ slug مطلوب."); return; }
    setSaving(true); setError(null); setSuccess(null);
    try {
      if (editing) {
        const { error: e } = await supabase.from("services").update(formData).eq("id", editing.id);
        if (e) throw e;
        setSuccess("تم تحديث الخدمة بنجاح.");
      } else {
        const { error: e } = await supabase.from("services").insert(formData);
        if (e) throw e;
        setSuccess("تم إنشاء الخدمة بنجاح.");
      }
      await fetchServices(); cancelForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) { setServices(prev => prev.filter(s => s.id !== id)); setDeleteConfirm(null); setSuccess("تم حذف الخدمة."); }
  };

  const currentServices = services.filter(s => s.category === "Current");
  const futureServices = services.filter(s => s.category === "Future");

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الخدمات</h1>
          <p className="text-gray-500 mt-1">أضف، عدّل، أو احذف خدمات الشركة</p>
        </div>
        {!creating && !editing && (
          <button onClick={startCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-alhurra-blue text-white font-semibold rounded-xl hover:bg-alhurra-blue/90 transition-all shadow-lg shadow-alhurra-blue/20 hover:scale-[1.02]">
            <Plus className="w-4 h-4" /> إضافة خدمة جديدة
          </button>
        )}
      </div>

      {/* ── Alerts ── */}
      {error && !creating && !editing && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && !creating && !editing && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}

      {/* ── Create / Edit Form ── */}
      {(creating || editing) && (
        <div className="relative bg-white rounded-2xl border border-alhurra-orange/40 shadow-xl shadow-alhurra-orange/5 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-alhurra-blue via-alhurra-orange to-alhurra-blue" />

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? "✏️ تعديل الخدمة" : "✨ خدمة جديدة"}
              </h2>
              <button onClick={cancelForm}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ── Left: Text Fields ── */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">العنوان الرئيسي *</label>
                  <input type="text" value={formData.title} onChange={e => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-alhurra-blue/40 focus:border-alhurra-blue outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="مثال: تخزين البضائع" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">العنوان الفرعي</label>
                  <input type="text" value={formData.subtitle} onChange={e => setField("subtitle", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-alhurra-blue/40 focus:border-alhurra-blue outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="مثال: مرافق مبردة وآمنة" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">الوصف التفصيلي</label>
                  <textarea value={formData.description} onChange={e => setField("description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-alhurra-blue/40 focus:border-alhurra-blue outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                    placeholder="وصف تفصيلي للخدمة..." />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    رابط الصفحة (Slug)
                    <button type="button" onClick={() => setGenerating(!generating)}
                      className="mr-2 text-xs font-normal text-alhurra-blue hover:underline">
                      {generating ? "(توليد تلقائي)" : "(يدوي)"}
                    </button>
                  </label>
                  <input type="text" value={formData.slug}
                    onChange={e => setField("slug", e.target.value)}
                    readOnly={generating}
                    className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all text-sm ${generating ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50 focus:bg-white focus:ring-2 focus:ring-alhurra-blue/40 focus:border-alhurra-blue"}`} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">التصنيف</label>
                    <select value={formData.category} onChange={e => setField("category", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-alhurra-blue/40 focus:border-alhurra-blue outline-none transition-all">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c === "Current" ? "🟢 حالي" : "🔵 مستقبلي"}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">ترتيب العرض</label>
                    <input type="number" min={0} value={formData.sort_order}
                      onChange={e => setField("sort_order", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-alhurra-blue/40 focus:border-alhurra-blue outline-none transition-all" />
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between bg-gradient-to-r from-alhurra-orange/5 to-amber-50 border border-alhurra-orange/20 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-alhurra-orange" />
                    <span className="text-sm font-semibold text-gray-700">خدمة مميزة (Featured)</span>
                  </div>
                  <button type="button" onClick={() => setField("featured", !formData.featured)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${formData.featured ? "bg-alhurra-orange" : "bg-gray-300"}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.featured ? "left-7" : "left-1"}`} />
                  </button>
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الأيقونة</label>
                  <div className="grid grid-cols-7 gap-1.5 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                    {ICON_OPTIONS.map(name => {
                      const IconComp = ICON_MAP[name];
                      const isSelected = formData.icon_name === name;
                      return (
                        <button key={name} type="button" onClick={() => setField("icon_name", name)} title={name}
                          className={`p-2 rounded-xl flex items-center justify-center transition-all ${isSelected ? "bg-alhurra-blue text-white shadow-md" : "hover:bg-gray-200 text-gray-500"}`}>
                          <IconComp className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">الأيقونة المختارة: <strong>{formData.icon_name}</strong></p>
                </div>
              </div>

              {/* ── Right: Image ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">صورة الخدمة</label>
                <ImageInput
                  value={formData.image_url}
                  onChange={url => setField("image_url", url)}
                  supabase={supabase}
                />
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
              <button type="button" onClick={cancelForm}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                إلغاء
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-7 py-2.5 bg-alhurra-blue text-white font-semibold rounded-xl hover:bg-alhurra-blue/90 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "جاري الحفظ..." : editing ? "تحديث الخدمة" : "إنشاء الخدمة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Services List ── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-10">
          <ServiceSection
            title="الخدمات الحالية" badge="متاح الآن" badgeColor="emerald"
            services={currentServices}
            onEdit={startEdit} onDelete={handleDelete}
            deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm}
          />
          <ServiceSection
            title="خدمات مستقبلية" badge="قريباً" badgeColor="blue"
            services={futureServices}
            onEdit={startEdit} onDelete={handleDelete}
            deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm}
          />
        </div>
      )}
    </div>
  );
}

// ─── Service Section ──────────────────────────────────────────
function ServiceSection({ title, badge, badgeColor, services, onEdit, onDelete, deleteConfirm, setDeleteConfirm }: {
  title: string; badge: string; badgeColor: "emerald" | "blue";
  services: Service[];
  onEdit: (s: Service) => void; onDelete: (id: string) => void;
  deleteConfirm: string | null; setDeleteConfirm: (id: string | null) => void;
}) {
  const badgeClasses = badgeColor === "emerald"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClasses}`}>{badge}</span>
        <span className="text-xs text-gray-400">({services.length} خدمة)</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      {services.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl py-12 text-center text-gray-400">
          <PackageOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">لا توجد خدمات في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {services.map(s => (
            <ServiceCard key={s.id} service={s} onEdit={onEdit} onDelete={onDelete}
              deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────
function ServiceCard({ service, onEdit, onDelete, deleteConfirm, setDeleteConfirm }: {
  service: Service; onEdit: (s: Service) => void; onDelete: (id: string) => void;
  deleteConfirm: string | null; setDeleteConfirm: (id: string | null) => void;
}) {
  const IconComp = ICON_MAP[service.icon_name] || PackageOpen;
  return (
    <div className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-4 py-3 hover:shadow-md hover:border-gray-200 transition-all">
      <div className="text-gray-300 group-hover:text-gray-400 cursor-grab">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        {service.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <IconComp className="w-6 h-6 text-slate-400" />
          </div>
        )}
        {service.featured && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-alhurra-orange rounded-full flex items-center justify-center">
            <Star className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">{service.title}</h3>
          {service.subtitle && <span className="text-xs text-gray-400 truncate hidden md:block">— {service.subtitle}</span>}
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">{service.description || "بدون وصف"}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{service.icon_name}</span>
          <span className="text-[10px] text-gray-400">ترتيب: {service.sort_order}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onEdit(service)}
          className="p-2 text-gray-400 hover:text-alhurra-blue hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
          <Edit className="w-4 h-4" />
        </button>
        {deleteConfirm === service.id ? (
          <div className="flex items-center gap-1">
            <button onClick={() => onDelete(service.id)}
              className="px-2.5 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">تأكيد</button>
            <button onClick={() => setDeleteConfirm(null)}
              className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium">إلغاء</button>
          </div>
        ) : (
          <button onClick={() => setDeleteConfirm(service.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
