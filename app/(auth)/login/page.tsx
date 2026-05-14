"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Lock, User } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let authenticated = false;

      // Try Supabase admin_accounts table first
      const { data, error: queryError } = await supabase
        .from("admin_accounts")
        .select("id")
        .eq("username", username)
        .eq("password", password)
        .maybeSingle();

      if (data) {
        authenticated = true;
      } else {
        // Log for debugging, then try local fallback
        if (queryError) console.error("DB error:", queryError.message);

        // Local fallback — works even before Supabase table is created
        if (username === "admin" && password === "admin") {
          authenticated = true;
        }
      }

      if (!authenticated) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      // Set session cookie (24 hours)
      document.cookie = `admin_session=true; path=/; max-age=${60 * 60 * 24}`;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <Image 
          src="https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg" 
          alt="background" 
          fill 
          className="object-cover"
        />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <Image 
              src="/logo.png" 
              alt="Alhurra Logo" 
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-extrabold text-white tracking-tight">
          Admin Portal
        </h2>
        <p className="mt-3 text-center text-sm text-slate-400 font-medium">
          Enter your credentials to manage Alhurra Logistics
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-dark py-10 px-4 shadow-2xl sm:rounded-[2.5rem] sm:px-12 border border-white/10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm animate-shake">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-slate-300 mb-2 ml-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-alhurra-orange focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-300 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-alhurra-orange focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-14 text-lg font-bold orange-gradient rounded-2xl shadow-xl shadow-alhurra-orange/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-none" disabled={loading}>
                {loading ? "Authenticating..." : "Login to Dashboard"}
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-slate-500 hover:text-white text-sm transition-colors">
              &larr; Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
