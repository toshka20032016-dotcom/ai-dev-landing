import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid Turbopack ENOENT on Windows CI/sandbox; webpack is stable for production.
  turbopack: undefined,
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
