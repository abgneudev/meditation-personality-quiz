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
