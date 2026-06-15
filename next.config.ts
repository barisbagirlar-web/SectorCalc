import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Paths that must not be rewritten to /en/* (static assets + locale/admin/api). */
const LOCALE_REWRITE_EXCLUDE =
  "tr(?:/|$)|de(?:/|$)|fr(?:/|$)|es(?:/|$)|ar(?:/|$)|en(?:/|$)|admin(?:/|$)|api(?:/|$)|_next(?:/|$)|img(?:/|$)|images(?:/|$)|icons(?:/|$)|.*\\.[^/]+$";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  eslint: {
    // Firebase `next build` runs lint inline; skip here (use `npm run lint` in CI/local).
    ignoreDuringBuilds: true,
  },
  // Large generated-tool SSG can exceed the default 60s per page.
  staticPageGenerationTimeout: 180,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@generated": path.join(process.cwd(), "generated"),
    };
    return config;
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
    staticGenerationRetryCount: 5,
    // Avoid flaky MODULE_NOT_FOUND / ENOENT races during large SSG on local + Firebase builds.
    cpus: 1,
    workerThreads: false,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 500,
  },
  async redirects() {
    return [
      { source: "/tools/free/:slug", destination: "/tools/generated/:slug", permanent: true },
      { source: "/tools/free-traffic/:slug", destination: "/tools/generated/:slug", permanent: true },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      {
        source: "/:locale(en|tr|de|fr|es|ar)/tools/free/:slug",
        destination: "/:locale/tools/generated/:slug",
        permanent: true,
      },
      {
        source: "/:locale(en|tr|de|fr|es|ar)/tools/free-traffic/:slug",
        destination: "/:locale/tools/generated/:slug",
        permanent: true,
      },
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

const sentryEnabled = Boolean(
  process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN,
);

const configWithIntl = withNextIntl(nextConfig);

export default sentryEnabled
  ? withSentryConfig(configWithIntl, {
      org: "sectorcalc",
      project: "sectorcalc",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      disableLogger: true,
    })
  : configWithIntl;
