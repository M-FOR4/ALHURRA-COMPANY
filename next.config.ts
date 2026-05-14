import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "yqyflmokwvbpxijrlxln.supabase.co", // User's Supabase Storage
      }
    ],
  },
};

export default nextConfig;
