/**
 * Search / retrieval crawler policy registry.
 * Training bots are a separate business decision from discovery bots.
 */

export const CRAWLER_POLICY = [
  {
    userAgent: 'Googlebot',
    purpose: 'search',
    allowPublic: true,
    policyClass: 'search-retrieval',
    lastVerifiedAt: '2026-07-26',
    source: 'https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers',
  },
  {
    userAgent: 'Bingbot',
    purpose: 'search',
    allowPublic: true,
    policyClass: 'search-retrieval',
    lastVerifiedAt: '2026-07-26',
    source: 'https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c968901',
  },
  {
    userAgent: 'OAI-SearchBot',
    purpose: 'chatgpt-search',
    allowPublic: true,
    policyClass: 'search-retrieval',
    lastVerifiedAt: '2026-07-26',
    source: 'https://platform.openai.com/docs/bots',
  },
  {
    userAgent: 'PerplexityBot',
    purpose: 'ai-search',
    allowPublic: true,
    policyClass: 'search-retrieval',
    lastVerifiedAt: '2026-07-26',
    source: 'https://docs.perplexity.ai/guides/bots',
  },
  {
    userAgent: 'GPTBot',
    purpose: 'training',
    allowPublic: false,
    policyClass: 'training',
    lastVerifiedAt: '2026-07-26',
    source: 'https://platform.openai.com/docs/bots',
  },
  {
    userAgent: 'ClaudeBot',
    purpose: 'training',
    allowPublic: false,
    policyClass: 'training',
    lastVerifiedAt: '2026-07-26',
    source: 'https://support.anthropic.com/en/articles/8896518',
  },
  {
    userAgent: 'CCBot',
    purpose: 'training',
    allowPublic: false,
    policyClass: 'training',
    lastVerifiedAt: '2026-07-26',
    source: 'https://commoncrawl.org/faq',
  },
];

export function discoveryAllowBots() {
  return CRAWLER_POLICY.filter((b) => b.allowPublic && b.policyClass === 'search-retrieval').map((b) => b.userAgent);
}
