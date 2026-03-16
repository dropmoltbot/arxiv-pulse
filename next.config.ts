import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel: Remove 'output: export' for dynamic features
  // Uncomment below for static hosting (Cloudflare):
  // output: 'export',
  
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
