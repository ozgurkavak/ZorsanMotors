import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ydnuyhdgiphicpgctqnh.supabase.co",
      },
      {
        protocol: "https",
        hostname: "imagesdl.dealercenter.net",
      },
    ],
  },
};

export default nextConfig;
