import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid incorrect monorepo root inference when multiple lockfiles exist.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
