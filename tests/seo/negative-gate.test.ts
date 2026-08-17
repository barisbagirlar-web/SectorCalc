import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { OPERATOR_JARGON_RE } from '../../seo/operator-jargon.mjs';
import { expectedBotPolicy } from '../../scripts/seo/crawl-ai-contract.ts';
import { CRAWLER_POLICY } from '../../seo/crawler-policy.mjs';
import { PAGES } from '../../seo/registry.mjs';

describe('negative gates — system must fail closed', () => {
  it('01 /guides hub file exists (404 would be a production defect)', () => {
    expect(existsSync('public/guides/index.html')).toBe(true);
    const html = readFileSync('public/guides/index.html', 'utf8');
    expect(html).toMatch(/<h1[^>]*>Industrial Engineering Calculation Guides/i);
  });

  it('06/07 operator jargon is detected by the public scanner regex', () => {
    expect(OPERATOR_JARGON_RE.test('SEO bait on a money page')).toBe(true);
    expect(OPERATOR_JARGON_RE.test('Google should cite this page')).toBe(true);
    expect(OPERATOR_JARGON_RE.test('query fan-out for LLMs')).toBe(true);
    expect(OPERATOR_JARGON_RE.test('Tolerance stack-up calculator')).toBe(false);
  });

  it('08/09 llms leak patterns are forbidden in generated maps', () => {
    const llms = readFileSync('public/llms.txt', 'utf8');
    expect(llms).not.toMatch(/billing\/health/);
    expect(llms).not.toMatch(/\/src\//);
    expect(llms).not.toMatch(/Cloud Scheduler/i);
    expect(llms).toContain('/guides');
  });

  it('11/12 private account is not sitemap or llms eligible', () => {
    const account = PAGES.find((p) => p.canonicalPath === '/account');
    expect(account?.sitemapEligible).toBe(false);
    expect(account?.llmEligible).toBe(false);
    expect(account?.indexDirective).toMatch(/noindex/i);
    const llms = readFileSync('public/llms.txt', 'utf8');
    expect(llms).not.toMatch(/https:\/\/sectorcalc\.com\/account(\b|$)/);
  });

  it('17-19 search crawlers stay allow; training crawlers stay block', () => {
    expect(expectedBotPolicy(CRAWLER_POLICY, 'Googlebot')).toBe('allow');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'Bingbot')).toBe('allow');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'OAI-SearchBot')).toBe('allow');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'GPTBot')).toBe('block');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'ClaudeBot')).toBe('block');
    expect(expectedBotPolicy(CRAWLER_POLICY, 'Google-Extended')).toBe('block');
  });

  it('24 public HTML is lang=en', () => {
    const hub = readFileSync('public/guides/index.html', 'utf8');
    expect(hub).toMatch(/<html[^>]*lang=["']en["']/i);
  });
});
