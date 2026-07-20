import type { NextConfig } from "next";
import type { Compiler } from "webpack";
import { withSentryConfig } from "@sentry/nextjs";
import path from "node:path";
import fs, { existsSync, mkdirSync, writeFileSync } from "node:fs";

class EnsureManifestStubsPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.done.tap("EnsureManifestStubsPlugin", () => {
      const nextDir = path.join(process.cwd(), ".next");
      const serverDir = path.join(nextDir, "server");

      if (!fs.existsSync(serverDir)) {
        fs.mkdirSync(serverDir, { recursive: true });
      }

      /* ── Pages Router stubs (App Router-only projects still need these for Firebase) ── */
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

      /* ── Manifest stubs ── */
      const manifestStubs: Array<[string, unknown]> = [
        ["pages-manifest.json", {}],
        ["app-paths-manifest.json", {}],
        ["server-reference-manifest.json", {}],
        ["next-font-manifest.json", { pages: {}, app: {}, appUsingSizeAdjust: false, pagesUsingSizeAdjust: false }],
        ["middleware-manifest.json", {}],
      ];
      for (const [name, content] of manifestStubs) {
        const p = path.join(serverDir, name);
        if (!fs.existsSync(p)) {
          fs.writeFileSync(p, JSON.stringify(content), "utf8");
        }
      }

      const appBuildManifestPath = path.join(nextDir, "app-build-manifest.json");
      if (!fs.existsSync(appBuildManifestPath)) {
        fs.writeFileSync(appBuildManifestPath, JSON.stringify({ pages: {} }), "utf8");
      }

      /* ── .nft.json stubs (Firebase trace collection requires these for every server file) ── */
      const appDir = path.join(serverDir, "app");
      if (fs.existsSync(appDir)) {
        function walk(dir: string) {
          let entries: fs.Dirent[];
          try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
          for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".js") && !entry.name.endsWith(".nft.json")) {
              const nftPath = full + ".nft.json";
              if (!fs.existsSync(nftPath)) {
                fs.writeFileSync(nftPath, JSON.stringify({ version: 1, files: [] }), "utf8");
              }
            }
          }
        }
        walk(appDir);
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

    // SECTORCALC_ROOT_ONLY_REWRITE_POLICY
    return {
      beforeFiles: [
                                                        ...indexNowVerification,
      ],
    };
  },

  reactStrictMode: true,
  // output: "standalone", // disabled — Firebase framework handles wrapping
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
            key: "Content-Language",
            value: "en",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.paddle.com https://*.firebaseio.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.stripe.com https://*.paddle.com https://*.cloudfunctions.net https://api.indexnow.org; frame-src 'self' https://js.stripe.com https://*.firebaseapp.com https://*.paddle.com; object-src 'none'; base-uri 'self'; form-action 'self' https://checkout.stripe.com;",
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
          // X-Robots-Tag is intentionally NOT set here.
          // Host-aware robots policy lives in src/middleware.ts
          // (preview/web.app → noindex; sectorcalc.com → index,follow;
          // hard-404 responses → noindex). A global next.config header
          // previously overrode preview noindex and caused dilution.
        ],
      },
      {
        source: "/(sitemap\\.xml|sitemaps/.*\\.xml)",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            // MIL-STD §5: Sitemap must signal "always-fresh" to Googlebot.
            // max-age=0 + must-revalidate ensures every crawl checks the CDN
            // edge. Firebase Hosting auto-adds ETag (SHA-256), so Googlebot
            // skips re-download when ETag matches (bandwidth saved).
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
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
      // www → non-www handled at firebase.json hosting redirects (Firebase CDN level)
      // Note: has:host redirect not supported in Firebase SSR framework integration
      { source: "/premium-tools", destination: "/pro-tools", permanent: true },
      { source: "/premium-tools/:path*", destination: "/pro-tools/:path*", permanent: true },
      { source: "/tools/fmea-rpn-calculator", destination: "/calculators/fmea-rpn", permanent: true },
      { source: "/tools/generated/:slug", destination: "/tools/pro/:slug", permanent: true },
      { source: "/tools/premium/:slug", destination: "/tools/pro/:slug", permanent: true },
      // RM-LEAN-001 lean spoke 301s handled in middleware.ts + firebase.json (exact HTTP 301; next.config permanent emits 308)
      // Slugless index redirects — prevent 404 on bare directory routes
      { source: "/guide", destination: "/guides", permanent: true },
      { source: "/upgrade-guide", destination: "/pricing", permanent: true },
      { source: "/tools/premium", destination: "/pricing", permanent: true },
      { source: "/resources", destination: "/calculator-library", permanent: true },
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

export default unwrapNextConfig(finalConfig);
