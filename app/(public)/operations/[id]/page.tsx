import { supabase } from "@/lib/supabase";
import NextStepsCTA from "@/components/public/NextStepsCTA";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Video, Image as ImageIcon, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_media(*)")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data;
}

async function getRecentPosts(excludeId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_media(*)")
    .eq("status", "published")
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error || !data) return [];
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Operation Not Found | Alhurra Logistics" };
  return {
    title: `${post.title} | Alhurra Operations`,
    description: post.content?.slice(0, 155) || `${post.operation_type} operation at Misrata Free Zone.`,
    openGraph: {
      title: post.title,
      description: post.content?.slice(0, 155),
      images: post.post_media?.find((m: { media_type: string }) => m.media_type === "image")?.media_url || undefined,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function OperationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const recentPosts = await getRecentPosts(id);

  const sortedMedia = (post.post_media || []).sort(
    (a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order
  );

  const primaryMedia = sortedMedia.find((m: { media_type: string }) => m.media_type === "video") || sortedMedia[0];

  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-24">
      
      {/* Main Container */}
      <div className="w-full px-4 md:px-8 xl:px-12 mx-auto mt-4">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          {/* Main Content Area (Left side, ~70%) */}
          <main className="w-full lg:w-[70%]">
            
            {/* Sleek Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/operations-log"
                className="group inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-alhurra-orange transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-alhurra-orange transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Feed
              </Link>
              <div className="flex items-center gap-2 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                <span>Operation</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>Details</span>
              </div>
            </div>

            {/* Sticky Media Header (No inner white borders) */}
            {primaryMedia && (
              <div className="sticky top-24 z-20 mb-8">
                <div className="relative aspect-video rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-slate-900 flex items-center justify-center">
                  {primaryMedia.media_type === "video" ? (
                    <video
                      src={primaryMedia.media_url}
                      controls
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={primaryMedia.media_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Content Body */}
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-10">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wide rounded-md mb-4">
                  {post.operation_type}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                </div>
              </div>

              {post.content && (
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>
              )}
            </article>

          </main>

          {/* Sidebar Area (Right side, ~30%) */}
          <aside className="w-full lg:w-[30%]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">
                Recent Logs
              </h2>
              
              {recentPosts.length === 0 ? (
                <p className="text-sm text-slate-500">No other operations found.</p>
              ) : (
                <div className="space-y-6">
                  {recentPosts.map((rp: any) => {
                    const thumb = rp.post_media?.find((m: any) => m.media_type === "image") ||
                                  rp.post_media?.find((m: any) => m.media_type === "video");
                    
                    return (
                      <Link key={rp.id} href={`/operations/${rp.id}`} className="group flex gap-4 items-start">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden relative border border-gray-100">
                          {thumb ? (
                            thumb.media_type === "image" ? (
                              <img src={thumb.media_url} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            ) : (
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <Video className="w-6 h-6 text-white/50" />
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        {/* Post Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-alhurra-blue transition-colors mb-1.5">
                            {rp.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">{formatDate(rp.created_at)}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link href="/operations-log" className="text-sm font-bold text-alhurra-orange hover:text-orange-600 transition-colors w-full inline-block text-center">
                  View All Operations
                </Link>
              </div>
            </div>
          </aside>
          
        </div>
      </div>

      <div className="mt-20">
        <NextStepsCTA />
      </div>


    </div>
  );
}
