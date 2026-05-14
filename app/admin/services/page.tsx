"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Save,
  X,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const CATEGORIES = ["Current", "Future"];

const ICON_OPTIONS = [
  "PackageOpen",
  "Warehouse",
  "Boxes",
  "Move",
  "FileText",
  "ClipboardCheck",
  "Building",
  "ThermometerSnowflake",
  "Truck",
  "Key",
  "Laptop",
  "Globe",
  "Anchor",
  "Container",
  "ShieldCheck",
];

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  icon_name: string;
  slug: string;
}

const emptyService: Omit<Service, "id"> = {
  title: "",
  description: "",
  category: "Current",
  icon_name: "PackageOpen",
  slug: "",
};

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

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("category")
      .order("title");

    if (!error && data) setServices(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  };

  const startEdit = (service: Service) => {
    setEditing(service);
    setCreating(false);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      icon_name: service.icon_name,
      slug: service.slug,
    });
    setError(null);
    setSuccess(null);
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setFormData(emptyService);
    setError(null);
    setSuccess(null);
  };

  const cancelForm = () => {
    setCreating(false);
    setEditing(null);
    setFormData(emptyService);
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!formData.slug.trim()) {
      setError("Slug is required.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (editing) {
        const { error: updateErr } = await supabase
          .from("services")
          .update(formData)
          .eq("id", editing.id);
        if (updateErr) throw updateErr;
        setSuccess("Service updated successfully.");
      } else {
        const { error: insertErr } = await supabase
          .from("services")
          .insert(formData);
        if (insertErr) throw insertErr;
        setSuccess("Service created successfully.");
      }

      await fetchServices();
      cancelForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirm(null);
      setSuccess("Service deleted.");
    }
  };

  const currentServices = services.filter((s) => s.category === "Current");
  const futureServices = services.filter((s) => s.category === "Future");

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Services Management
          </h1>
          <p className="text-gray-500 mt-1">
            Add, edit, or reclassify services
          </p>
        </div>
        {!creating && !editing && (
          <Button onClick={startCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        )}
      </div>

      {/* Banners */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && !creating && !editing && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}

      {/* Create / Edit Form */}
      {(creating || editing) && (
        <Card className="mb-8 border-alhurra-orange">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? "Edit Service" : "New Service"}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alhurra-blue focus:border-alhurra-blue"
                    placeholder="e.g., Bonded Warehousing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-alhurra-blue focus:border-alhurra-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alhurra-blue focus:border-alhurra-blue"
                  placeholder="Service description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-alhurra-blue focus:border-alhurra-blue"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon Name
                  </label>
                  <select
                    value={formData.icon_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        icon_name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-alhurra-blue focus:border-alhurra-blue"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={cancelForm}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving
                    ? "Saving..."
                    : editing
                    ? "Update Service"
                    : "Create Service"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Current Services */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-alhurra-blue mb-4 border-b pb-2">
              Current Services ({currentServices.length})
            </h2>
            {currentServices.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">
                No current services found.
              </p>
            ) : (
              <div className="space-y-2">
                {currentServices.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    onEdit={startEdit}
                    onDelete={handleDelete}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Future Services */}
          <div>
            <h2 className="text-xl font-bold text-alhurra-orange mb-4 border-b pb-2">
              Future Expansion Plans ({futureServices.length})
            </h2>
            {futureServices.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">
                No future services found.
              </p>
            ) : (
              <div className="space-y-2">
                {futureServices.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    onEdit={startEdit}
                    onDelete={handleDelete}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Sub-component for service rows
function ServiceRow({
  service,
  onEdit,
  onDelete,
  deleteConfirm,
  setDeleteConfirm,
}: {
  service: Service;
  onEdit: (s: Service) => void;
  onDelete: (id: string) => void;
  deleteConfirm: string | null;
  setDeleteConfirm: (id: string | null) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-5 py-3 hover:shadow-sm transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-900">{service.title}</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            {service.icon_name}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate mt-0.5">
          {service.description || "No description"}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onEdit(service)}
          className="p-2 text-gray-400 hover:text-alhurra-blue rounded-md hover:bg-gray-100 transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        {deleteConfirm === service.id ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(service.id)}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Confirm
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setDeleteConfirm(service.id)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
