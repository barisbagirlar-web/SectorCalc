import type { NextConfig } from "next";
import type { Compiler } from "webpack";
import { withSentryConfig } from "@sentry/nextjs";
import path from "node:path";
import fs, { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { LOCALE_REWRITE_EXCLUDE } from "./src/lib/infrastructure/i18n/locale-rewrite-exclude";
import {
  xRobotsTagValue,
  X_ROBOTS_TAG_HEADER,
} from "./src/lib/infrastructure/seo/seo-indexing-control";

class EnsureManifestStubsPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.done.tap("EnsureManifestStubsPlugin", () => {
      const nextDir = path.join(process.cwd(), ".next");
      const serverDir = path.join(nextDir, "server");
      
      if (!fs.existsSync(serverDir)) {
        fs.mkdirSync(serverDir, { recursive: true });
      }

      const pagesDir = path.join(serverDir, "pages");
      if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir, { recursive: true });
      }
      for (const name of ["_document.js", "_app.js"]) {
        const p = path.join(pagesDir, name);
        if (!fs.existsSync(p)) {
          fs.writeFileSync(p, "module.exports = {};\n", "utf8");
        }
      }

      const fontManifestPath = path.join(serverDir, "next-font-manifest.json");
      if (!fs.existsSync(fontManifestPath)) {
        fs.writeFileSync(fontManifestPath, JSON.stringify({
          "pages": {},
          "app": {},
          "appUsingSizeAdjust": false,
          "pagesUsingSizeAdjust": false
        }), "utf8");
      }

      const appBuildManifestPath = path.join(nextDir, "app-build-manifest.json");
      if (!fs.existsSync(appBuildManifestPath)) {
        fs.writeFileSync(appBuildManifestPath, JSON.stringify({ pages: {} }), "utf8");
      }

      const notFoundDir = path.join(serverDir, "app", "_not-found");
      if (!fs.existsSync(notFoundDir)) {
        fs.mkdirSync(notFoundDir, { recursive: true });
      }
      const notFoundNftPath = path.join(notFoundDir, "page.js.nft.json");
      if (!fs.existsSync(notFoundNftPath)) {
        fs.writeFileSync(notFoundNftPath, JSON.stringify({ version: 1, files: [] }), "utf8");
      }
    });
  }
}

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
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
      ],
    };
  },

  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: ["@react-pdf/renderer"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 300,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins ??= [];
      config.plugins.push(new EnsureManifestStubsPlugin());
      config.cache = false;
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
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 50,
  },
  async headers() {
    return [
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
          {
            key: X_ROBOTS_TAG_HEADER,
            value: xRobotsTagValue(),
          },
        ],
      },
      {
        source: "/(sitemap\\.xml|sitemap-.*\\.xml)",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
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
      { source: "/premium-tools", destination: "/pro-tools", permanent: true },
      { source: "/premium-tools/:path*", destination: "/pro-tools/:path*", permanent: true },
      { source: "/tools/free/:slug", destination: "/tools/generated/:slug", permanent: true },
      { source: "/tools/free-traffic/:slug", destination: "/tools/generated/:slug", permanent: true },
      { source: "/tools/fmea-rpn-calculator", destination: "/calculators/fmea-rpn", permanent: true },
    ];
  },
};

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

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const sentryEnabled = Boolean(
  process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN,
);

const finalConfig = sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: "sectorcalc",
      project: "sectorcalc",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      disableLogger: true,
    })
  : nextConfig;

export default unwrapNextConfig(withNextIntl(finalConfig));
