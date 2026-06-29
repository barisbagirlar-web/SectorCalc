/**
 * Path prefixes excluded from locale-based URL rewrites.
 * These routes serve as-is without locale prefix.
 */
export const LOCALE_REWRITE_EXCLUDE: readonly string[] = [
  "/api/",
  "/admin/",
  "/_next/",
  "/static/",
  "/images/",
  "/favicon",
  "/robots.txt",
  "/sitemap",
  "/sw.js",
  "/workbox",
];
