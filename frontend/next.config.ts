import type { NextConfig } from "next";

// De backend (../backend) draait los; /api/* sturen we door zodat de browser geen CORS nodig heeft.
const API_URL = process.env.API_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  // De hoofdmap heeft ook een package-lock.json (voor het gezamenlijke startcommando); dit is de frontend-map.
  turbopack: { root: __dirname },
  async headers() {
    return [
      {
        // Service worker (pushmeldingen): altijd de nieuwste versie laden, alleen eigen scripts.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
