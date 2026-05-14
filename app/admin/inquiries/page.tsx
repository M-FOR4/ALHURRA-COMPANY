"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
  Inbox,
} from "lucide-react";

interface Inquiry {
  id: string;
  company_name: string;
  email: string;
  phone: string;
  service_requested: string;
  message: string;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const supabase = createSupabaseBrowser();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setInquiries(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("contact_inquiries")
      .delete()
      .eq("id", id);
    if (!error) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setDeleteConfirm(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Contact inquiries from potential clients
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
          Total: <span className="font-bold text-gray-900">{inquiries.length}</span> inquiries
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No inquiries received yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => {
            const isExpanded = expandedId === inquiry.id;
            return (
              <Card
                key={inquiry.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="py-0 px-0">
                  {/* Header Row */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : inquiry.id)
                    }
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="bg-orange-50 p-2 rounded-full">
                        <Building2 className="w-5 h-5 text-alhurra-orange" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {inquiry.company_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {inquiry.email || "—"}
                          </span>
                          {inquiry.service_requested && (
                            <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">
                              {inquiry.service_requested}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(inquiry.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Company
                          </label>
                          <p className="text-sm text-gray-900 mt-1 font-medium">
                            {inquiry.company_name}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Email
                          </label>
                          <p className="text-sm text-gray-900 mt-1">
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="text-alhurra-blue hover:underline"
                            >
                              {inquiry.email || "Not provided"}
                            </a>
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Phone
                          </label>
                          <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {inquiry.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Service Requested
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {inquiry.service_requested || "Not specified"}
                        </p>
                      </div>
                      <div className="mb-4">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Message
                        </label>
                        <p className="text-sm text-gray-700 mt-1 leading-relaxed bg-white p-4 rounded-lg border border-gray-200">
                          {inquiry.message}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        {deleteConfirm === inquiry.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-red-600">
                              Delete this inquiry?
                            </span>
                            <button
                              onClick={() => handleDelete(inquiry.id)}
                              className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(inquiry.id)}
                            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
