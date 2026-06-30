import type { NextConfig } from "next";
import type { Compiler } from "webpack";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";
import path from "node:path";
import fs from "node:fs";
import { LOCALE_REWRITE_EXCLUDE } from "./src/lib/infrastructure/i18n/locale-rewrite-exclude";

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
      const appPathsManifestPath = path.join(serverDir, "app-paths-manifest.json");
      // Only create if missing — Next.js may have generated it for hybrid apps.
      if (!fs.existsSync(pagesManifestPath)) {
        fs.mkdirSync(serverDir, { recursive: true });
        fs.writeFileSync(pagesManifestPath, JSON.stringify({}), "utf8");
      }
      if (!fs.existsSync(appPathsManifestPath)) {
        fs.mkdirSync(serverDir, { recursive: true });
        fs.writeFileSync(appPathsManifestPath, JSON.stringify({}), "utf8");
      }
    });
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: ["@react-pdf/renderer"],
  eslint: {
    // Firebase `next build` runs lint inline; skip here (use `npm run lint` in CI/local).
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Generated calculator files have known type-safe arithmetic issues (boolean/string
    // in arithmetic context) that are repaired by fix:generated-types in prebuild.
    // The prebuild also runs a standalone typecheck (tsc --noEmit) so this is safe.
    ignoreBuildErrors: true,
  },
  // Large generated-tool SSG can exceed the default 60s per page.
  staticPageGenerationTimeout: 300,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins ??= [];
      config.plugins.push(new EnsureManifestStubsPlugin());
      // Disable webpack persistent filesystem cache for production builds.
      // SSG worker crashes with "SyntaxError: Unexpected end of JSON input" when
      // the cached context module for dynamic i18n JSON imports gets corrupted.
      // Deterministic SSG > incremental build speed.
      config.cache = false;
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      "@generated": path.join(process.cwd(), "generated"),
    };
    return config;
  },
  outputFileTracingIncludes: {
    "/*": ["generated/schemas/**/*.json"],
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
    staticGenerationRetryCount: 5,
    // Use default workerThreads:true (thread-based workers) to avoid jest-worker
    // child-process race conditions on large App Router page sets.
    // Single SSG worker at a time prevents module-load races.
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
      // Premium → Pro rebrand redirects (301, SEO-safe)
      { source: "/premium-tools", destination: "/pro-tools", permanent: true },
      { source: "/premium-tools/:path*", destination: "/pro-tools/:path*", permanent: true },
      {
        source: "/:locale(en|tr|de|fr|es|ar)/premium-tools",
        destination: "/:locale/pro-tools",
        permanent: true,
      },
      {
        source: "/:locale(en|tr|de|fr|es|ar)/premium-tools/:path*",
        destination: "/:locale/pro-tools/:path*",
        permanent: true,
      },
      { source: "/tools/free/:slug", destination: "/tools/generated/:slug", permanent: true },
      { source: "/tools/free-traffic/:slug", destination: "/tools/generated/:slug", permanent: true },
      // /en/ paths removed — let /en/... reach middleware for proper locale cookie handling
      // (The rewrites below handle root → /en/* internally.)
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
        // Root / handled by middleware rewrite
        // All other paths handled by middleware rewrite
      ],
    };
  },
};

/**
 * Unwrap ES module interop wrapper injected by HOCs (next-intl, Sentry)
 * in standalone/Firebase builds — strips {__esModule, default} so the
 * Next.js config validator doesn't reject them.
 */
function unwrapNextConfig<T>(maybeWrapped: T): T {
  if (
    maybeWrapped &&
    typeof maybeWrapped === "object" &&
    "__esModule" in (maybeWrapped as Record<string, unknown>) &&
    "default" in (maybeWrapped as Record<string, unknown>)
  ) {
    return (maybeWrapped as Record<string, unknown>).default as T;
  }
  return maybeWrapped;
}

const sentryEnabled = Boolean(
  process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN,
);

const configWithIntl = withNextIntl(nextConfig);

const finalConfig = sentryEnabled
  ? withSentryConfig(configWithIntl, {
      org: "sectorcalc",
      project: "sectorcalc",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      disableLogger: true,
    })
  : configWithIntl;

export default unwrapNextConfig(finalConfig);
