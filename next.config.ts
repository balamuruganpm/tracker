import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silences the custom webpack warning by defining empty turbopack config
  experimental: {
    // turbopack option goes here if using experimental settings or root settings depending on Next version
  },
  // In Next.js, turbopack configuration can be passed under `experimental` or as a top-level key depending on version. 
  // Let's add it under root level as requested by the error message (turbopack: {}):
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;


