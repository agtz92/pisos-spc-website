import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // AVIF first (≈20-30% smaller than WebP) for the image-heavy home/landing
    // pages. Vercel caches each optimized variant for a year, so the on-demand
    // transform cost is paid once, not per visitor.
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-cms-bulk-website-generator.onrender.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
