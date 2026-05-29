import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@dossierbj/core", "@dossierbj/db", "@dossierbj/rag"],
};

export default nextConfig;
