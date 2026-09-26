import type { NextConfig } from "next";

// De backend (../backend) draait los; /api/* sturen we door zodat de browser geen CORS nodig heeft.
const API_URL = process.env.API_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
