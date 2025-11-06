import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trritavoaewykjuyzjty.supabase.co',
      },
    ],
    // Optimize caching for production
    minimumCacheTTL: 31536000, // 1 year for static images
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Optimize for production performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable compression
  compress: true,
};

export default nextConfig;
