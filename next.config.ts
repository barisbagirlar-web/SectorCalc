import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Paths that must not be rewritten to /en/* (static assets + locale/admin/api). */
const LOCALE_REWRITE_EXCLUDE =
  "tr(?:/|$)|de(?:/|$)|fr(?:/|$)|es(?:/|$)|ar(?:/|$)|en(?:/|$)|admin(?:/|$)|api(?:/|$)|_next(?:/|$)|img(?:/|$)|images(?:/|$)|icons(?:/|$)|.*\\.[^/]+$";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
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
    const indexNowKey = process.env.INDEXNOW_KEY?.trim();
    const indexNowVerification = indexNowKey
      ? [{ source: `/${indexNowKey}.txt`, destination: "/api/indexnow-verification" }]
      : [];

    return {
      beforeFiles: [
        ...indexNowVerification,
        { source: "/", destination: "/en" },
        {
          source: `/:path((?!${LOCALE_REWRITE_EXCLUDE}).*)`,
          destination: "/en/:path",
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
