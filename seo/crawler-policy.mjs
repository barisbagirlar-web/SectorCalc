/**
 * SectorCalc crawler policy registry.
 * Search/retrieval, user-directed fetch, ad verification and training are separate policy classes.
 * Public robots artifacts and verification gates must agree with this registry.
 */

export const CRAWLER_POLICY = Object.freeze([
  { userAgent: 'Googlebot', purpose: 'google-search', allowPublic: true, policyClass: 'search-retrieval', lastVerifiedAt: '2026-08-10', source: 'https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers' },
  { userAgent: 'Googlebot-Image', purpose: 'google-image-search', allowPublic: true, policyClass: 'search-retrieval', lastVerifiedAt: '2026-08-10', source: 'https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers' },
  { userAgent: 'Bingbot', purpose: 'bing-search', allowPublic: true, policyClass: 'search-retrieval', lastVerifiedAt: '2026-08-10', source: 'https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c968901' },
  { userAgent: 'OAI-SearchBot', purpose: 'chatgpt-search', allowPublic: true, policyClass: 'search-retrieval', lastVerifiedAt: '2026-08-10', source: 'https://help.openai.com/en/articles/12627856-publishers-and-developers-faq' },
  { userAgent: 'ChatGPT-User', purpose: 'chatgpt-user-fetch', allowPublic: true, policyClass: 'user-retrieval', lastVerifiedAt: '2026-08-10', source: 'https://platform.openai.com/docs/bots' },
  { userAgent: 'OAI-AdsBot', purpose: 'chatgpt-ads-verification', allowPublic: true, policyClass: 'ads-verification', lastVerifiedAt: '2026-08-10', source: 'https://help.openai.com/en/articles/20001243-advertiser-guidance-for-allowing-openai-web-crawlers' },
  { userAgent: 'PerplexityBot', purpose: 'perplexity-search', allowPublic: true, policyClass: 'search-retrieval', lastVerifiedAt: '2026-08-10', source: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers' },
  { userAgent: 'Perplexity-User', purpose: 'perplexity-user-fetch', allowPublic: true, policyClass: 'user-retrieval', lastVerifiedAt: '2026-08-10', source: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers' },
  { userAgent: 'Claude-SearchBot', purpose: 'claude-search', allowPublic: true, policyClass: 'search-retrieval', lastVerifiedAt: '2026-08-10', source: 'https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler' },
  { userAgent: 'Claude-User', purpose: 'claude-user-fetch', allowPublic: true, policyClass: 'user-retrieval', lastVerifiedAt: '2026-08-10', source: 'https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler' },
  { userAgent: 'GPTBot', purpose: 'model-training', allowPublic: false, policyClass: 'training', lastVerifiedAt: '2026-08-10', source: 'https://platform.openai.com/docs/bots' },
  { userAgent: 'ClaudeBot', purpose: 'model-training', allowPublic: false, policyClass: 'training', lastVerifiedAt: '2026-08-10', source: 'https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler' },
  { userAgent: 'Google-Extended', purpose: 'google-ai-use-control', allowPublic: false, policyClass: 'training', lastVerifiedAt: '2026-08-10', source: 'https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers' },
  { userAgent: 'CCBot', purpose: 'common-crawl', allowPublic: false, policyClass: 'training', lastVerifiedAt: '2026-08-10', source: 'https://commoncrawl.org/ccbot' },
  { userAgent: 'cohere-ai', purpose: 'ai-training', allowPublic: false, policyClass: 'training', lastVerifiedAt: '2026-08-10', source: 'policy-default' },
  { userAgent: 'FacebookBot', purpose: 'ai-training', allowPublic: false, policyClass: 'training', lastVerifiedAt: '2026-08-10', source: 'policy-default' },
]);

export function discoveryAllowBots() {
  return CRAWLER_POLICY
    .filter((bot) => bot.allowPublic && ['search-retrieval', 'user-retrieval'].includes(bot.policyClass))
    .map((bot) => bot.userAgent);
}

export function requiredPublicBots() {
  return CRAWLER_POLICY.filter((bot) => bot.allowPublic).map((bot) => bot.userAgent);
}

export function blockedPublicBots() {
  return CRAWLER_POLICY.filter((bot) => !bot.allowPublic).map((bot) => bot.userAgent);
}
