import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

const COMMON_DISALLOW = ["/admin/", "/api/", "/logs/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...COMMON_DISALLOW, "/*/tools/premium-schema/*/print", "/tools/premium-schema/*/print"],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot"],
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot"],
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: ["CCBot", "Diffbot"],
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
