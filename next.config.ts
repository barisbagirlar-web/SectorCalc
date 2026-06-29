import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable built-in gzip so CDN (Fastly / Google Frontend) can serve brotli
  compress: false,
  // outputFileTracing moved to system default in Next.js 15
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
    staticGenerationRetryCount: 3,
  },
  async redirects() {
    return [
      { source: "/premium-tools", destination: "/pricing", permanent: true },
      { source: "/blog", destination: "/case-studies", permanent: true },
      { source: "/formulas", destination: "/calculator-library", permanent: true },
      { source: "/api", destination: "/developer-showcase", permanent: true },
      { source: "/signup", destination: "/login", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Public assets (images, icons, fonts, WASM) — content-hash friendly names
        source: "/(images|icons|img|wasm|fonts)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // HTML pages — short browser cache, CDN surrogate headers for Fastly
        // Browser: always revalidate (no stale HTML in browser cache)
        // CDN (Fastly): cache 10 min, serve stale up to 60s while revalidating
        // Surrogate-Key enables targeted purge after deploy
        source: "/:path((?!(?:_next|api|_vercel|sw\\.js|.*\\..*)$).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Surrogate-Control",
            value: "max-age=600, stale-while-revalidate=60",
          },
          {
            key: "Surrogate-Key",
            value: "html",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
