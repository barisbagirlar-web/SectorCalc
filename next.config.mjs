import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      { source: "/premium-tools", destination: "/pro-tools", permanent: true },
      { source: "/:locale(tr|de|fr|es|ar)/premium-tools", destination: "/:locale/pro-tools", permanent: true },

      { source: "/blog", destination: "/case-studies", permanent: true },
      { source: "/:locale(tr|de|fr|es|ar)/blog", destination: "/:locale/case-studies", permanent: true },
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
