import type { NextConfig } from "next";
import type { Compiler } from "webpack";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";
import path from "node:path";
import fs from "node:fs";
import { LOCALE_REWRITE_EXCLUDE } from "./src/lib/i18n/locale-rewrite-exclude";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Paths that must not be rewritten to /en/* (static assets + locale/admin/api). */
const LOCALE_REWRITE_EXCLUDE_PATTERN = LOCALE_REWRITE_EXCLUDE;

/**
 * Webpack plugin — ensures Next.js manifest stubs exist after compilation
 * but before SSG ("Collecting page data").
 * Next.js 15 App Router does not create pages-manifest.json; without this
 * stub the build crashes during page data collection.
 */
class EnsureManifestStubsPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.done.tap("EnsureManifestStubsPlugin", () => {
      const nextDir = path.join(process.cwd(), ".next");
      const serverDir = path.join(nextDir, "server");
      const pagesManifestPath = path.join(serverDir, "pages-manifest.json");
      // Only create if missing — Next.js may have generated it for hybrid apps.
      if (!fs.existsSync(pagesManifestPath)) {
        fs.mkdirSync(serverDir, { recursive: true });
        fs.writeFileSync(pagesManifestPath, JSON.stringify({}), "utf8");
      }
    });
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  eslint: {
    // Firebase `next build` runs lint inline; skip here (use `npm run lint` in CI/local).
    ignoreDuringBuilds: true,
  },
  // Large generated-tool SSG can exceed the default 60s per page.
  staticPageGenerationTimeout: 300,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins ??= [];
      config.plugins.push(new EnsureManifestStubsPlugin());
    }
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
    workerThreads: false,
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 50,
  },
  async headers() {
    return [
      // Security headers (HSTS, XSS protection, etc.)
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      // Sitemap cache headers
      {
        source: "/sitemap/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      // AI metadata cache
      {
        source: "/(ai\\.txt|llms\\.txt|ai-.*\\.(?:json|txt|jsonl)|sectorcalc-index\\.txt|services-products\\.txt|faq-knowledge\\.txt)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=7200, stale-while-revalidate=86400",
          },
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
        ],
      },
    ];
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
      ? [
          { source: `/${indexNowKey}.txt`, destination: "/api/indexnow-verification" },
          { source: "/.well-known/indexnow-key.txt", destination: "/api/indexnow-verification" },
        ]
      : [];

    return {
      beforeFiles: [
        ...indexNowVerification,
        { source: "/", destination: "/en" },
        {
          source: `/:path((?!${LOCALE_REWRITE_EXCLUDE_PATTERN}).*)`,
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
