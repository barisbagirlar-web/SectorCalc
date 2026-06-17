import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/semantic/site-url";

const PRIVATE_DISALLOW = [
  "/.env",
  "/_next/",
  "/app/",
  "/admin",
  "/admin/",
  "/api/",
  "/dashboard",
  "/dashboard/",
  "/checkout",
  "/checkout/",
  "/account",
  "/account/",
  "/login",
  "/login/",
  "/signup",
  "/signup/",
  "/preview",
  "/preview/",
  "/verification-queue",
  "/verification-queue/",
  "/logs/",
  "/404",
  "/500",
  "/*?*",
  "/*?page=",
];

const AI_INDEX_ALLOW = [
  "/api-public/",
  "/premium/",
  "/.well-known/openapi.yaml",
  "/llms.txt",
  "/ai.txt",
  "/ai-tool-index.json",
  "/ai-tool-index.txt",
  "/ai-categories.json",
  "/ai-tool-routes.json",
  "/ai-search-manifest.json",
  "/ai-embedding-source.jsonl",
  "/sectorcalc-index.txt",
  "/services-products.txt",
  "/faq-knowledge.txt",
  "/sitemap.xml",
  "/sitemap/",
];

const AI_BOT_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", ...AI_INDEX_ALLOW],
        disallow: PRIVATE_DISALLOW,
      },
      ...AI_BOT_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ["/", ...AI_INDEX_ALLOW],
        disallow: PRIVATE_DISALLOW,
      })),
      {
        userAgent: ["Applebot", "ClaudeBot"],
        allow: "/",
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: ["CCBot", "Diffbot"],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
