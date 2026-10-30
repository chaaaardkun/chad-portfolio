import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  sassOptions: {
    // Lets modules write `@use "tokens" as *;` instead of relative paths.
    loadPaths: [path.join(process.cwd(), "src/styles")],
  },
};

export default nextConfig;
