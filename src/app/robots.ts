import type { MetadataRoute } from "next";

/**
 * robots.txt via Next.js metadata convention.
 * Implements L1 host/canonical + §3 LLM references per SEO spec.
 * NOTE: robots.txt/route.ts has priority; this file is a fallback
 * for deployment environments that prefer the MetadataRoute API.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/dashboard/", "/checkout/", "/account/"],
      },
    ],
    sitemap: "https://sectorcalc.com/sitemap.xml",
  };
}
