import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en" },
        {
          source:
            "/:path((?!tr(?:/|$)|de(?:/|$)|fr(?:/|$)|es(?:/|$)|ar(?:/|$)|en(?:/|$)|admin(?:/|$)|api(?:/|$)|_next(?:/|$)).*)",
          destination: "/en/:path",
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
