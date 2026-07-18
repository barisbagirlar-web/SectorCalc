/**
 * SectorCalc - robots.txt generation (AI Crawler Governance)
 * ==========================================================
 * Kept in a standalone module (not seo-indexing-control) so it is NOT pulled
 * into the next.config.ts transpilation chain, which cannot resolve the
 * ai-crawler-policy import at config-load time.
 */

import {
  AI_ANSWER_AGENTS,
  BLOCKED_AGENTS,
  SEARCH_ENGINE_AGENTS,
} from "@/lib/features/ai/ai-crawler-policy";

const SITE_URL = "https://sectorcalc.com";

/** Non-public paths blocked for every agent. */
const GLOBAL_DISALLOW_PATHS: readonly string[] = [
  "/api/",
  "/admin/",
  "/dashboard/",
  "/account/",
  "/checkout/",
  "/login",
  "/signup",
  "/preview/",
  "/verification-queue/",
  "/verification-queue",
  "/logs/",
  "/*?*sort=",
];

function allowBlock(agent: string): string {
  return [
    `User-agent: ${agent}`,
    "Allow: /",
    ...GLOBAL_DISALLOW_PATHS.map((path) => `Disallow: ${path}`),
  ].join("\n");
}

function disallowBlock(agent: string, note: string): string {
  return [`# ${note}`, `User-agent: ${agent}`, "Disallow: /"].join("\n");
}

/**
 * Generate a governed robots.txt that separates classic search engines,
 * AI answer/citation engines and bulk/training-only scrapers.
 *
 * - Search engines: full allow (organic SEO).
 * - AI answer engines: full allow (zero-click referral + product discovery).
 * - Bulk/scraper bots: disallow (bandwidth cost, no attributed referral).
 * - Google-Extended / Applebot-Extended: explicit AI-training opt-in (allow).
 * - CCBot: explicit training-corpus opt-out (disallow).
 */
export function generateRobotsTxt(): string {
  const searchBlocks = SEARCH_ENGINE_AGENTS.map((rule) =>
    [`# ${rule.operator} - ${rule.note}`, allowBlock(rule.agent)].join("\n"),
  );

  const aiAllowBlocks = AI_ANSWER_AGENTS.map((rule) =>
    [`# ${rule.operator} - ${rule.note}`, allowBlock(rule.agent)].join("\n"),
  );

  const blockedBlocks = BLOCKED_AGENTS.map((rule) =>
    disallowBlock(rule.agent, `${rule.operator} - ${rule.note}`),
  );

  const defaultBlock = [
    "# Default policy for all other agents",
    "User-agent: *",
    "Allow: /",
    ...GLOBAL_DISALLOW_PATHS.map((path) => `Disallow: ${path}`),
  ].join("\n");

  return [
    "# SectorCalc robots.txt - AI Crawler Governance",
    `# Search engines allowed: ${SEARCH_ENGINE_AGENTS.length}`,
    `# AI answer engines allowed: ${AI_ANSWER_AGENTS.length}`,
    `# Bulk/scraper agents blocked: ${BLOCKED_AGENTS.length}`,
    "# AI directives: /llms.txt  |  AI access policy: /ai.txt",
    "",
    "# ===== Search engines (organic discovery) =====",
    searchBlocks.join("\n\n"),
    "",
    "# ===== AI answer & citation engines (zero-click referral allowed) =====",
    aiAllowBlocks.join("\n\n"),
    "",
    "# ===== Bulk / training-only / SEO-scraper agents (blocked) =====",
    blockedBlocks.join("\n\n"),
    "",
    "# ===== Default =====",
    defaultBlock,
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Sitemap: ${SITE_URL}/llms.txt`,
    `Host: ${SITE_URL}`,
    "",
  ].join("\n");
}
