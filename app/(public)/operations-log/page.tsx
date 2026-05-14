import { supabase } from "@/lib/supabase";
import OperationCard from "@/components/public/OperationCard";
import WhyPartnerSection from "@/components/public/WhyPartnerSection";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Field Operations Log | Alhurra Logistics",
  description:
    "Live operations log from Alhurra Company — Misrata Free Zone, Libya.",
};

const OPERATION_TYPES = [
  "All",
  "Unloading",
  "Storage",
  "Cargo Sorting",
  "Repositioning",
  "Customs Coordination",
  "Inspection",
];

async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_media(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return data;
}

export default async function OperationsLogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const allPosts = await getPosts();

  const posts =
    type && type !== "All"
      ? allPosts.filter((p) => p.operation_type === type)
      : allPosts;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="max-w-2xl">
            <p className="text-alhurra-orange text-xs font-bold uppercase tracking-[0.25em] mb-3">
              Field Operations
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              Operations Log
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Documented operations from the Misrata Free Zone. Real work, real results.
            </p>
          </div>
        </div>

        {/* ─ Filter Pills ─ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {OPERATION_TYPES.map((opType) => {
              const isActive = (!type && opType === "All") || type === opType;
              return (
                <Link
                  key={opType}
                  href={
                    opType === "All"
                      ? "/operations-log"
                      : `/operations-log?type=${encodeURIComponent(opType)}`
                  }
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-white text-slate-500 border-gray-200 hover:border-slate-400 hover:text-slate-700"
                  }`}
                >
                  {opType}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {posts.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">📋</div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">
              No operations logged yet
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              {type && type !== "All"
                ? `No "${type}" operations have been published.`
                : "Check back soon — our team logs operations regularly."}
            </p>
            {type && type !== "All" && (
              <Link
                href="/operations-log"
                className="mt-6 inline-block text-alhurra-orange font-bold hover:underline"
              >
                ← View all operations
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Count */}
            <p className="text-sm text-slate-400 font-medium mb-4">
              {posts.length} operation{posts.length !== 1 ? "s" : ""}
              {type && type !== "All" ? ` · ${type}` : " · All types"}
            </p>

            {/* ── 3-col blog grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <OperationCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  operation_type={post.operation_type}
                  created_at={post.created_at}
                  post_media={post.post_media || []}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Why Partner Section ── */}
      <WhyPartnerSection />
    </div>
  );
}
