"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import PostEditor from "@/components/admin/PostEditor";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  Image as ImageIcon,
  Video,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  operation_type: string;
  status: string;
  created_at: string;
  post_media?: { id: string; media_type: string; media_url: string }[];
}

export default function AdminPostsPage() {
  const supabase = createSupabaseBrowser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*, post_media(*)")
      .order("created_at", { ascending: false });

    if (!error && data) setPosts(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (postId: string) => {
    // post_media rows cascade-delete via FK
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setDeleteConfirm(null);
    }
  };

  const toggleStatus = async (post: Post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("posts")
      .update({ status: newStatus })
      .eq("id", post.id);
    if (!error) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
      );
    }
  };

  // --- CREATE / EDIT VIEW ---
  if (view === "create" || view === "edit") {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => {
              setView("list");
              setEditingPost(null);
            }}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to list
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {view === "edit" ? "Edit Operation Log" : "New Operation Log"}
          </h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <PostEditor
              editPost={editingPost || undefined}
              onSuccess={() => {
                fetchPosts();
                setView("list");
                setEditingPost(null);
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operations Logs</h1>
          <p className="text-gray-500 mt-1">
            Manage operation posts and media uploads
          </p>
        </div>
        <Button onClick={() => setView("create")}>
          <Plus className="w-4 h-4 mr-2" /> New Log Entry
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-gray-500 mb-4">No operation logs yet.</p>
            <Button onClick={() => setView("create")}>
              <Plus className="w-4 h-4 mr-2" /> Create your first log
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {post.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                        {post.operation_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {post.post_media && post.post_media.length > 0 && (
                        <span className="flex items-center gap-1">
                          {post.post_media.filter(
                            (m) => m.media_type === "image"
                          ).length > 0 && (
                            <span className="flex items-center gap-0.5">
                              <ImageIcon className="w-3.5 h-3.5" />
                              {
                                post.post_media.filter(
                                  (m) => m.media_type === "image"
                                ).length
                              }
                            </span>
                          )}
                          {post.post_media.filter(
                            (m) => m.media_type === "video"
                          ).length > 0 && (
                            <span className="flex items-center gap-0.5 ml-2">
                              <Video className="w-3.5 h-3.5" />
                              {
                                post.post_media.filter(
                                  (m) => m.media_type === "video"
                                ).length
                              }
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleStatus(post)}
                      title={
                        post.status === "published" ? "Unpublish" : "Publish"
                      }
                      className="p-2 text-gray-400 hover:text-alhurra-blue rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {post.status === "published" ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setView("edit");
                      }}
                      title="Edit"
                      className="p-2 text-gray-400 hover:text-alhurra-blue rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {deleteConfirm === post.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(post.id)}
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
                        onClick={() => setDeleteConfirm(post.id)}
                        title="Delete"
                        className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
