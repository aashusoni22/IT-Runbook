import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: ".next-local",
  outputFileTracingRoot: process.cwd()
};

export default nextConfig;
