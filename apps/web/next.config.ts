import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["@dossierbj/core", "@dossierbj/rag"],
};

export default nextConfig;
