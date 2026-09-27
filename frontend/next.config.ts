import type { NextConfig } from "next";

// De backend (../backend) draait los; /api/* sturen we door zodat de browser geen CORS nodig heeft.
const API_URL = process.env.API_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  // De hoofdmap heeft ook een package-lock.json (voor het gezamenlijke startcommando); dit is de frontend-map.
  turbopack: { root: __dirname },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
