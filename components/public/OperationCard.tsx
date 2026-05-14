"use client";

import Link from "next/link";
import { Image as ImageIcon, Video } from "lucide-react";

interface PostMedia {
  id: string;
  media_type: "image" | "video";
  media_url: string;
  display_order: number;
}

interface OperationCardProps {
  id: string;
  title: string;
  content: string;
  operation_type: string;
  created_at: string;
  post_media: PostMedia[];
}

const OPERATION_COLORS: Record<string, { bg: string; text: string }> = {
  Unloading:               { bg: "bg-blue-100",   text: "text-blue-700"   },
  Storage:                 { bg: "bg-emerald-100", text: "text-emerald-700"},
  "Cargo Sorting":         { bg: "bg-purple-100",  text: "text-purple-700" },
  Repositioning:           { bg: "bg-amber-100",   text: "text-amber-700"  },
  "Customs Coordination":  { bg: "bg-indigo-100",  text: "text-indigo-700" },
  Inspection:              { bg: "bg-rose-100",    text: "text-rose-700"   },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function OperationCard({
  id, title, content, operation_type, created_at, post_media,
}: OperationCardProps) {
  const cover = post_media.find((m) => m.media_type === "image") ||
                post_media.find((m) => m.media_type === "video") || null;

  const color = OPERATION_COLORS[operation_type] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <Link href={`/operations/${id}`} className="group block h-full">
      <article className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 h-full flex flex-col">
        
        {/* Media Thumbnail (16:9 aspect ratio) */}
        <div className="relative overflow-hidden bg-gray-100 aspect-video">
          {cover ? (
            cover.media_type === "image" ? (
              <img src={cover.media_url} alt={title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                 <Video className="w-10 h-10 text-white/50" />
                 <div className="absolute inset-0 bg-black/20" />
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-gray-300" />
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm ${color.bg} ${color.text}`}>
              {operation_type}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-1">
          {/* Title (2 lines max) */}
          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-alhurra-blue transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Meta: Date and brief excerpt (1-2 lines) */}
          <div className="mb-4 flex-1">
            <p className="text-xs text-gray-400 font-medium mb-2">{formatDate(created_at)}</p>
            {content && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {content}
              </p>
            )}
          </div>

          {/* Action Link */}
          <div className="pt-4 border-t border-gray-100 mt-auto">
            <span className="text-sm font-semibold text-alhurra-orange group-hover:text-orange-600 transition-colors flex items-center">
              View Details <span className="ml-1 group-hover:translate-x-1 transition-transform">-&gt;</span>
            </span>
          </div>
        </div>

      </article>
    </Link>
  );
}
