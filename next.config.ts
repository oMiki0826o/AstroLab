/*
 * File: next.config.ts
 * Modification: 2026-10-11 - Consistent project Pages static export.
 */
import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
if (basePath && (!basePath.startsWith("/") || basePath.endsWith("/"))) {
  throw new Error("NEXT_PUBLIC_BASE_PATH must start with '/' and not end with '/'.");
}
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};
export default nextConfig;
