import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [65, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Google OAuth profile pictures (lh3/lh4/lh5… googleusercontent.com).
      {
        protocol: "https",
        hostname: "lh*.googleusercontent.com",
        pathname: "/**",
      },
      // Demo catalogue photography (lib/demo-product-images.ts).
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 14400,
  },
  serverExternalPackages: ["pg", "pg-connection-string", "pgpass"],
  turbopack: {
    resolveAlias: {
      "util/types": { browser: "./lib/empty-module.ts" },
      dns: { browser: "./lib/empty-module.ts" },
      fs: { browser: "./lib/empty-module.ts" },
      net: { browser: "./lib/empty-module.ts" },
      tls: { browser: "./lib/empty-module.ts" },
      crypto: { browser: "./lib/empty-module.ts" },
      path: { browser: "./lib/empty-module.ts" },
      os: { browser: "./lib/empty-module.ts" },
      stream: { browser: "./lib/empty-module.ts" },
      http: { browser: "./lib/empty-module.ts" },
      https: { browser: "./lib/empty-module.ts" },
      zlib: { browser: "./lib/empty-module.ts" },
      child_process: { browser: "./lib/empty-module.ts" },
      util: { browser: "./lib/empty-module.ts" },
    },
  },
};

export default nextConfig;
