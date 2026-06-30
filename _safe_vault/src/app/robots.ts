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

/**
 * AI bot agents that are allowed full index access.
 * These are search/reference AIs we want to be cited/sourced by.
 */
const ALLOWED_AI_BOT_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "Applebot",
  "ClaudeBot",
  "Claude-Web",
  "Applebot-Extended",
] as const;

/**
 * AI training/scraping bots that are explicitly disallowed.
 * These consume content without returning referral traffic.
 */
const DISALLOWED_AI_BOT_AGENTS: readonly { userAgent: string; reason?: string }[] = [
  { userAgent: "CCBot", reason: "CommonCrawl — training data collector" },
  { userAgent: "Diffbot", reason: "Knowledge graph scraper" },
  { userAgent: "FacebookBot", reason: "Social preview scraper (no SEO value)" },
  { userAgent: "Bytespider", reason: "TikTok/ByteDance training bot" },
  { userAgent: "Amazonbot", reason: "Amazon scraping bot" },
  { userAgent: "SemrushBot", reason: "SEO tool crawler (use API instead)" },
  { userAgent: "AhrefsBot", reason: "SEO tool crawler (use API instead)" },
  { userAgent: "DotBot", reason: "Moz SEO crawler" },
  { userAgent: "DataForSeoBot", reason: "SEO data crawler" },
  { userAgent: "MeltwaterBot", reason: "Media monitoring crawler" },
  { userAgent: "PetalBot", reason: "Chinese search engine (high crawl cost)" },
  { userAgent: "MJ12bot", reason: "Majestic SEO crawler" },
  { userAgent: "BLEXBot", reason: "Web crawler" },
  { userAgent: "SeekportBot", reason: "German search engine" },
  { userAgent: "YandexBot", reason: "Limited value outside RU market" },
  { userAgent: "Nutch", reason: "Open source crawler" },
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow everything except private
      {
        userAgent: "*",
        allow: ["/", ...AI_INDEX_ALLOW],
        disallow: PRIVATE_DISALLOW,
      },
      // Premium AI bots: full access
      ...ALLOWED_AI_BOT_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ["/", ...AI_INDEX_ALLOW],
        disallow: PRIVATE_DISALLOW,
      })),
      // AI reference agents: crawl-delay for polite crawling
      {
        userAgent: ["ChatGPT-User", "GPTBot", "Google-Extended", "PerplexityBot", "ClaudeBot"],
        allow: ["/", ...AI_INDEX_ALLOW],
        disallow: PRIVATE_DISALLOW,
        crawlDelay: 2,
      },
      // Search engine bots: standard access with crawl budget priorities
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot", "Slurp"],
        allow: "/",
        disallow: PRIVATE_DISALLOW,
        crawlDelay: 1,
      },
      // Consumer AI agents: limited to non-commercial content
      {
        userAgent: ["Claude-Web", "Applebot-Extended"],
        allow: ["/guides/", "/methodology/", "/case-studies/", ...AI_INDEX_ALLOW],
        disallow: ["/app/", "/tools/", ...PRIVATE_DISALLOW],
      },
      // Explicitly disallowed bots
      ...DISALLOWED_AI_BOT_AGENTS.map((bot) => ({
        userAgent: bot.userAgent,
        disallow: "/",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
