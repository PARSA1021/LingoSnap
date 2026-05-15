import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Avoid incorrect monorepo root inference when multiple lockfiles exist.
  turbopack: {
    root: __dirname,
  },
};

export default withSerwist(nextConfig);
