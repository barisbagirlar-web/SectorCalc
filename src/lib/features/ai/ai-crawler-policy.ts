/**
 * SectorCalc - AI Crawler Governance Policy
 * =========================================
 * Single source of truth for how search engines and AI agents are treated.
 *
 * Governance model (premium segment, zero-click referral strategy):
 *   1. SEARCH ENGINES        -> full allow (classic organic discovery).
 *   2. AI ANSWER / CITATION  -> full allow. These agents answer end-user
 *      questions and cite/link sources, driving zero-click referrals and
 *      product discovery. Blocking them removes SectorCalc from AI answers.
 *   3. BULK / TRAINING-ONLY  -> disallow. Bulk corpus and SEO-scraper bots
 *      consume bandwidth without producing attributed referral traffic.
 *
 * This module is consumed by:
 *   - /robots.txt   (src/lib/infrastructure/seo/seo-indexing-control.ts)
 *   - /ai.txt       (src/app/ai.txt/route.ts)
 *   - /llms.txt     (src/lib/features/ai/build-llms-txt.ts)
 */

export type CrawlerAgent = {
  /** Exact User-agent token as emitted by the crawler. */
  readonly agent: string;
  /** Operator / product the agent belongs to. */
  readonly operator: string;
  /** Governance rationale (human + machine readable). */
  readonly note: string;
};

/**
 * Classic search engines. Full allow: organic SEO surface.
 */
export const SEARCH_ENGINE_AGENTS: readonly CrawlerAgent[] = [
  { agent: "Googlebot", operator: "Google Search", note: "Primary organic search index." },
  { agent: "Googlebot-Image", operator: "Google Images", note: "Image search index." },
  { agent: "Bingbot", operator: "Microsoft Bing", note: "Bing + Copilot organic index." },
  { agent: "Applebot", operator: "Apple", note: "Siri / Spotlight suggestions." },
  { agent: "DuckDuckBot", operator: "DuckDuckGo", note: "DuckDuckGo organic index." },
  { agent: "Slurp", operator: "Yahoo", note: "Yahoo organic index." },
];

/**
 * AI answer / citation engines. Full allow: these agents surface SectorCalc
 * tools directly in user-facing answers with source attribution, which is the
 * core zero-click conversion channel.
 */
export const AI_ANSWER_AGENTS: readonly CrawlerAgent[] = [
  { agent: "GPTBot", operator: "OpenAI", note: "ChatGPT knowledge + answer grounding." },
  { agent: "ChatGPT-User", operator: "OpenAI", note: "User-initiated ChatGPT browsing (high purchase intent)." },
  { agent: "OAI-SearchBot", operator: "OpenAI", note: "ChatGPT Search citations." },
  { agent: "Google-Extended", operator: "Google Gemini", note: "Gemini + AI Overviews grounding." },
  { agent: "ClaudeBot", operator: "Anthropic", note: "Claude knowledge + answers." },
  { agent: "Claude-Web", operator: "Anthropic", note: "Claude live browsing." },
  { agent: "Claude-User", operator: "Anthropic", note: "User-initiated Claude browsing." },
  { agent: "Claude-SearchBot", operator: "Anthropic", note: "Claude search citations." },
  { agent: "anthropic-ai", operator: "Anthropic", note: "Legacy Anthropic crawler token." },
  { agent: "PerplexityBot", operator: "Perplexity", note: "Perplexity answer index (cited)." },
  { agent: "Perplexity-User", operator: "Perplexity", note: "User-initiated Perplexity browsing." },
  { agent: "Applebot-Extended", operator: "Apple Intelligence", note: "Apple Intelligence grounding." },
  { agent: "Amazonbot", operator: "Amazon", note: "Alexa / Rufus assistant answers." },
  { agent: "Meta-ExternalAgent", operator: "Meta AI", note: "Meta AI assistant answers." },
  { agent: "meta-externalagent", operator: "Meta AI", note: "Meta AI assistant (lowercase token)." },
  { agent: "cohere-ai", operator: "Cohere", note: "Cohere answer grounding." },
  { agent: "YouBot", operator: "You.com", note: "You.com answer index (cited)." },
  { agent: "DuckAssistBot", operator: "DuckDuckGo", note: "DuckAssist AI answers." },
  { agent: "MistralAI-User", operator: "Mistral", note: "Le Chat user-initiated browsing." },
];

/**
 * Bulk / training-only / SEO-scraper agents. Disallow: high bandwidth cost,
 * no attributed referral traffic, or aggressive crawl behaviour.
 */
export const BLOCKED_AGENTS: readonly CrawlerAgent[] = [
  { agent: "CCBot", operator: "Common Crawl", note: "Bulk training corpus, no live citation or referral." },
  { agent: "Bytespider", operator: "ByteDance", note: "Aggressive bulk crawl, no referral." },
  { agent: "Diffbot", operator: "Diffbot", note: "Third-party data resale scraper." },
  { agent: "Omgilibot", operator: "Webz.io", note: "Bulk data resale corpus." },
  { agent: "Omgili", operator: "Webz.io", note: "Bulk data resale corpus." },
  { agent: "ImagesiftBot", operator: "ImageSift", note: "Bulk image dataset scraper." },
  { agent: "PetalBot", operator: "Huawei", note: "Low-value regional scraper." },
  { agent: "DataForSeoBot", operator: "DataForSEO", note: "SEO data resale scraper." },
  { agent: "SemrushBot", operator: "Semrush", note: "Competitor SEO intelligence scraper." },
  { agent: "AhrefsBot", operator: "Ahrefs", note: "Competitor SEO intelligence scraper." },
  { agent: "MJ12bot", operator: "Majestic", note: "Backlink intelligence scraper." },
  { agent: "DotBot", operator: "Moz", note: "SEO link-graph scraper." },
  { agent: "magpie-crawler", operator: "Brandwatch", note: "Social listening scraper." },
  { agent: "Timpibot", operator: "Timpi", note: "Bulk dataset scraper." },
  { agent: "Scrapy", operator: "Generic", note: "Generic scraping framework token." },
];

/** Machine-readable summary counts for governance surfaces. */
export const AI_CRAWLER_POLICY_SUMMARY = {
  searchEngines: SEARCH_ENGINE_AGENTS.length,
  aiAnswerEngines: AI_ANSWER_AGENTS.length,
  blockedAgents: BLOCKED_AGENTS.length,
} as const;
