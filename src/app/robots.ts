import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/semantic/site-url";

const COMMON_DISALLOW = [
  "/admin",
  "/admin/",
  "/api/admin",
  "/api/internal",
  "/api/",
  "/logs/",
  "/dashboard",
  "/dashboard/",
  "/preview",
  "/preview/",
  "/verification-queue",
  "/verification-queue/",
  "/*/print",
  "/*/tools/premium-schema/*/print",
  "/tools/premium-schema/*/print",
];

const AI_BOT_DISALLOW = [
  "/admin",
  "/admin/",
  "/api/admin",
  "/api/internal",
  "/api/",
  "/logs/",
  "/dashboard",
  "/dashboard/",
  "/preview",
  "/preview/",
  "/verification-queue",
  "/verification-queue/",
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
        userAgent: "GPTBot",
        allow: "/",
        disallow: AI_BOT_DISALLOW,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: AI_BOT_DISALLOW,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: AI_BOT_DISALLOW,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: AI_BOT_DISALLOW,
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot"],
        allow: "/",
        disallow: ["/admin/", "/api/", "/logs/", "/*/print", "/tools/premium-schema/*/print"],
      },
      {
        userAgent: ["CCBot", "Diffbot"],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
