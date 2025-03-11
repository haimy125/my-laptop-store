import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "8MB", // Hoặc lớn hơn nếu cần
    },
  },
};

export default nextConfig;
