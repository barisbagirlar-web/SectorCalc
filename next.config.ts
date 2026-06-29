import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
};

export default withNextIntl(nextConfig);
