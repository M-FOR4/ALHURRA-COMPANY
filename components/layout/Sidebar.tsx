"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  MessageSquare,
  Ship,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Operations Logs", icon: FileText },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/services", label: "Services", icon: Ship },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Clear custom admin session cookie
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col w-64 bg-alhurra-blue text-white h-screen fixed left-0 top-0">
      {/* Header */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700 gap-2">
        <Ship className="w-7 h-7 text-alhurra-orange" />
        <span className="font-bold text-lg tracking-wider text-alhurra-orange">
          ADMIN PANEL
        </span>
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${active ? "text-alhurra-orange" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-gray-400 hover:bg-red-600/80 hover:text-white rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
