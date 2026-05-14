"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowser } from "@/lib/supabase";
import {
  validateFile,
  getMediaType,
  formatFileSize,
  ALL_ALLOWED_TYPES,
} from "@/lib/file-validation";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Operation types from context.md
const OPERATION_TYPES = [
  "Unloading",
  "Storage",
  "Cargo Sorting",
  "Repositioning",
  "Customs Coordination",
  "Inspection",
];

interface MediaPreview {
  file: File;
  preview: string;
  type: "image" | "video";
}

interface PostEditorProps {
  onSuccess?: () => void;
  editPost?: {
    id: string;
    title: string;
    content: string;
    operation_type: string;
    status: string;
  };
}

export default function PostEditor({ onSuccess, editPost }: PostEditorProps) {
  const supabase = createSupabaseBrowser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(editPost?.title || "");
  const [content, setContent] = useState(editPost?.content || "");
  const [operationType, setOperationType] = useState(
    editPost?.operation_type || OPERATION_TYPES[0]
  );
  const [status, setStatus] = useState(editPost?.status || "draft");
  const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setError(null);

    const newPreviews: MediaPreview[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file.");
        return;
      }
      const type = getMediaType(file.type);
      if (!type) continue;
      newPreviews.push({
        file,
        preview: URL.createObjectURL(file),
        type,
      });
    }

    setMediaFiles((prev) => [...prev, ...newPreviews]);
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      let postId = editPost?.id;

      if (editPost) {
        // Update existing post
        const { error: updateError } = await supabase
          .from("posts")
          .update({
            title,
            content,
            operation_type: operationType,
            status,
          })
          .eq("id", editPost.id);

        if (updateError) throw updateError;
      } else {
        // Create new post
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .insert({
            title,
            content,
            operation_type: operationType,
            status,
          })
          .select("id")
          .single();

        if (postError) throw postError;
        postId = postData.id;
      }

      // Upload media files to Supabase Storage and link to post
      for (let i = 0; i < mediaFiles.length; i++) {
        const media = mediaFiles[i];
        const ext = media.file.name.split(".").pop();
        const filePath = `posts/${postId}/${Date.now()}_${i}.${ext}`;

        // 1. Upload file to logistics_media bucket
        const { error: storageError } = await supabase.storage
          .from("logistics_media")
          .upload(filePath, media.file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (storageError) throw storageError;

        // 2. Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("logistics_media").getPublicUrl(filePath);

        // 3. Insert into post_media table
        const { error: mediaError } = await supabase
          .from("post_media")
          .insert({
            post_id: postId,
            media_type: media.type,
            media_url: publicUrl,
            display_order: i,
          });

        if (mediaError) throw mediaError;
      }

      setSuccess(true);
      if (!editPost) {
        // Reset form for new post
        setTitle("");
        setContent("");
        setOperationType(OPERATION_TYPES[0]);
        setStatus("draft");
        setMediaFiles([]);
      }
      onSuccess?.();
    } catch (err: unknown) {
      console.error("PostEditor error:", err);
      // Show the real Supabase/server error for debugging
      let message = "An unexpected error occurred.";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "object" && err !== null) {
        // Supabase errors have a message field
        const sbErr = err as { message?: string; details?: string; hint?: string; code?: string };
        message = sbErr.message || sbErr.details || JSON.stringify(err);
        if (sbErr.hint) message += ` — Hint: ${sbErr.hint}`;
        if (sbErr.code) message += ` (code: ${sbErr.code})`;
      }
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error / Success banners */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {editPost ? "Post updated successfully!" : "Post created successfully!"}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Container Unloading — Batch #2045"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alhurra-blue focus:border-alhurra-blue"
          required
        />
      </div>

      {/* Operation Type + Status row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operation Type
          </label>
          <select
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-alhurra-blue focus:border-alhurra-blue"
          >
            {OPERATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-alhurra-blue focus:border-alhurra-blue"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Operation Details
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder="Describe the operation, include container IDs, quantities, notes..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alhurra-blue focus:border-alhurra-blue"
        />
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Media Files
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-alhurra-blue hover:bg-blue-50/30 transition-colors"
        >
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Click to upload images or videos
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Images: max 10MB · Videos: max 50MB · JPEG, PNG, WebP, GIF, MP4,
            WebM, MOV
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALL_ALLOWED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Media Previews */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaFiles.map((media, idx) => (
            <div
              key={idx}
              className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              {media.type === "image" ? (
                <img
                  src={media.preview}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-100">
                  <Video className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">
                    {media.file.name}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 flex items-center justify-between">
                <span className="text-xs text-white flex items-center gap-1">
                  {media.type === "image" ? (
                    <ImageIcon className="w-3 h-3" />
                  ) : (
                    <Video className="w-3 h-3" />
                  )}
                  {formatFileSize(media.file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeMedia(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {editPost ? "Updating..." : "Publishing..."}
            </>
          ) : editPost ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  );
}
