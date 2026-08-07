import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // 301s from indexed Placester URLs go here once that site is retired.
      // See CLAUDE.md §11.
    ];
  },
};

export default nextConfig;
