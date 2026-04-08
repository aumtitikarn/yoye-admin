import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
       source: "/api/v1/:path*",
        // เติม || "http://localhost:3002" ไว้ข้างหลัง
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
