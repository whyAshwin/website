import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // "Cache Components" (PPR) and partial prefetching are not compatible with
  // export mode, and buy nothing for a site that is already fully static.
  // The site is a portfolio, so it is a static build: `next build` emits an
  // `out/` directory that any plain static host can serve.
  output: "export",
  // Static export has no image optimizer, and every image here is already a
  // web-sized JPEG (~400 KB), so serve the originals untouched.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
