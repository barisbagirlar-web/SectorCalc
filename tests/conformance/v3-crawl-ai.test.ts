import { describe, expect, it } from 'vitest';
import { assertDiscoveryParity, assertVerifiedBotEvidence, changedUrlsForIndexNow, expectedBotPolicy } from '../../scripts/seo/crawl-ai-contract.ts';

describe('SEO V3 Phase 8 crawl/AI', () => {
  const policy = { aiTraining: 'block' as const, aiSearch: 'allow' as const, custom: { GPTBot: 'block' as const, 'OAI-SearchBot': 'allow' as const, PerplexityBot: 'allow' as const } };

  it('keeps AI search and training policy separated', () => {
    expect(expectedBotPolicy(policy, 'OAI-SearchBot')).toBe('allow');
    expect(expectedBotPolicy(policy, 'PerplexityBot')).toBe('allow');
    expect(expectedBotPolicy(policy, 'GPTBot')).toBe('block');
    expect(expectedBotPolicy(policy, 'ClaudeBot')).toBe('block');
  });

  it('requires byte-identical llm and llms discovery files and canonical URLs', () => {
    const text = '# SectorCalc\n- Sitemap: https://sectorcalc.com/sitemap.xml\n- Tool: https://sectorcalc.com/calculator/oee-teep\n';
    expect(() => assertDiscoveryParity(text, text)).not.toThrow();
    expect(() => assertDiscoveryParity(text, `${text}extra`)).toThrow(/LLM_DISCOVERY_DRIFT/);
  });

  it('does not label an unverified request as a verified bot', () => {
    expect(() => assertVerifiedBotEvidence(undefined)).toThrow(/VERIFIED_BOT_EVIDENCE_MISSING/);
  });

  it('selects only changed/new URLs for IndexNow submission', () => {
    expect(changedUrlsForIndexNow(['https://sectorcalc.com/a'], ['https://sectorcalc.com/a', 'https://sectorcalc.com/b'])).toEqual(['https://sectorcalc.com/b']);
  });
});
