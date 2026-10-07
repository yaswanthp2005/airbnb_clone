import type { NextConfig } from "next";

import { OPTIMIZED_IMAGE_HOSTS } from "./src/constants/images";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: OPTIMIZED_IMAGE_HOSTS.map(hostname => ({
      protocol: "https" as const,
      hostname,
      pathname: "/**",
    })),
  },
};

export default nextConfig;
