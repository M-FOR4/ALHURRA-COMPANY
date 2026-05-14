import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText, MessageSquare, Settings, TrendingUp, Users, Ship } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Don't cache admin dashboard

async function getDashboardStats() {
  const [postsCount, inquiriesCount, servicesCount] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("contact_inquiries").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
  ]);

  return {
    posts: postsCount.count || 0,
    inquiries: inquiriesCount.count || 0,
    services: servicesCount.count || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">Welcome back. Here is the latest activity from Alhurra Logistics.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-sm font-bold">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          System Live
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Operations Logs", value: stats.posts, icon: Ship, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Client Inquiries", value: stats.inquiries, icon: MessageSquare, color: "text-alhurra-orange", bg: "bg-orange-50" },
          { title: "Total Services", value: stats.services, icon: Settings, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-8">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.title}</CardTitle>
              <div className={`${item.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="text-4xl font-black text-slate-900 mb-1">{item.value}</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Active Data</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border-slate-100 shadow-sm p-4">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold text-slate-900">Recent Operations</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
             <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                   <div key={item} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                         <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <div className="h-4 w-32 bg-slate-100 rounded mb-2 animate-pulse"></div>
                         <div className="h-3 w-20 bg-slate-50 rounded animate-pulse"></div>
                      </div>
                   </div>
                ))}
                <p className="text-xs text-center text-slate-400 font-medium pt-4">View all logs in the Operations section</p>
             </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-[2.5rem] border-slate-100 shadow-sm p-4 bg-slate-900 text-white">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold">Latest Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                   <div key={item} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white/40">
                         <Users className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <div className="h-4 w-32 bg-white/10 rounded mb-2 animate-pulse"></div>
                         <div className="h-3 w-20 bg-white/5 rounded animate-pulse"></div>
                      </div>
                   </div>
                ))}
                <p className="text-xs text-center text-white/20 font-medium pt-4">View all inquiries in the Messages section</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
