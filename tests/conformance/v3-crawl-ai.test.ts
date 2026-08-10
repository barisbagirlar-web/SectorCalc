import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CRAWLER_POLICY } from '../../seo/crawler-policy.mjs';
import { assertDiscoveryParity, assertVerifiedBotEvidence, changedUrlsForIndexNow, expectedBotPolicy } from '../../scripts/seo/crawl-ai-contract.ts';

describe('SEO V3 Phase 8 crawl/AI', () => {
  it('separates search/retrieval from training policy using the crawler SSOT', () => {
    expect(expectedBotPolicy(CRAWLER_POLICY, 'OAI-SearchBot')).toBe('allow');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'OAI-AdsBot')).toBe('allow');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'Perplexity-User')).toBe('allow');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'Claude-SearchBot')).toBe('allow');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'GPTBot')).toBe('block');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'ClaudeBot')).toBe('block');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'Google-Extended')).toBe('block');
  });

  it('requires byte-identical llm and llms discovery files and canonical URLs', () => {
    const llm = readFileSync('public/llm.txt', 'utf8');
    const llms = readFileSync('public/llms.txt', 'utf8');
    expect(() => assertDiscoveryParity(llm, llms)).not.toThrow();
  });

  it('does not accept a user-agent string alone as verified-bot evidence', () => {
    expect(() => assertVerifiedBotEvidence({ userAgent: 'Googlebot' })).toThrow(/NOT_VERIFIED/);
    expect(() => assertVerifiedBotEvidence({ userAgent: 'Googlebot', verified: true, verificationMethod: 'published-ip-range' })).not.toThrow();
  });

  it('selects only changed/new URLs for IndexNow candidates', () => {
    expect(changedUrlsForIndexNow(['https://sectorcalc.com/a'], ['https://sectorcalc.com/a', 'https://sectorcalc.com/b'])).toEqual(['https://sectorcalc.com/b']);
  });
});
