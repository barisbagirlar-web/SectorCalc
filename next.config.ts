import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint CI'da ayrıca çalıştırılıyor; build/deploy sırasında bloklamasın.
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
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      // Fallback redirects for legacy or broken nav links
      { source: "/pro-tools", destination: "/premium-tools", permanent: true },
      { source: "/:locale(tr|de|fr|es|ar)/pro-tools", destination: "/:locale/premium-tools", permanent: true },
      { source: "/blog", destination: "/guides", permanent: true },
      { source: "/:locale(tr|de|fr|es|ar)/blog", destination: "/:locale/guides", permanent: true },
      { source: "/formulas", destination: "/calculator-library", permanent: true },
      { source: "/:locale(tr|de|fr|es|ar)/formulas", destination: "/:locale/calculator-library", permanent: true },
      { source: "/api", destination: "/developer-showcase", permanent: true },
      { source: "/:locale(tr|de|fr|es|ar)/api", destination: "/:locale/developer-showcase", permanent: true },
      { source: "/signup", destination: "/login", permanent: true },
      { source: "/:locale(tr|de|fr|es|ar)/signup", destination: "/:locale/login", permanent: true },
    ];
  },
  async rewrites() {
    const indexNowKey = process.env.INDEXNOW_KEY?.trim();
    const indexNowVerification = indexNowKey
      ? [{ source: `/${indexNowKey}.txt`, destination: "/api/indexnow-verification" }]
      : [];

    return {
      beforeFiles: indexNowVerification,
    };
  },
};

export default withNextIntl(nextConfig);
