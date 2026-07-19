import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
        poll: 1000, // Check for changes every second instead of constant listening
        aggregateTimeout: 300, // Delay rebuilds slightly to aggregate multiple changes
      };
    }
    return config;
  },
};

export default nextConfig;

