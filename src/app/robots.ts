import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/lib/seo/global-seo-config";

const COMMON_DISALLOW = [
  "/admin/",
  "/api/",
  "/logs/",
  "/*/print",
  "/*/tools/premium-schema/*/print",
  "/tools/premium-schema/*/print",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot"],
        allow: "/",
        disallow: ["/admin/", "/api/", "/logs/", "/*/print", "/tools/premium-schema/*/print"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot"],
        allow: "/",
        disallow: ["/admin/", "/api/", "/logs/"],
      },
      {
        userAgent: ["CCBot", "Diffbot"],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
  };
}
