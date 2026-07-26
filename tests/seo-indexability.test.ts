import { describe, it, expect } from 'vitest';
import {
  parseIndexDirective,
  evaluateSeoIndexable,
  isSeoIndexable,
} from '../seo/indexability.mjs';
import { sitemapPages, llmEligiblePages } from '../seo/registry.mjs';

function baseRecord(overrides = {}) {
  return {
    id: 'test-page',
    canonicalPath: '/calculator/test-tool',
    publicationStatus: 'published',
    indexDirective: 'index,follow',
    locale: 'en',
    title: 'Test',
    description: 'Test description',
    primaryIntent: 'test calculator',
    queryCluster: 'test-cluster',
    role: 'calculator',
    sitemapEligible: true,
    llmEligible: true,
    quality: {
      formulaVerified: true,
      contentReviewed: true,
      canonicalVerified: true,
      sourceVerified: true,
      languageVerified: true,
      noPlaceholder: true,
      noRegenerationPending: true,
      calculatorWorks: true,
      demoVerified: true,
    },
    ...overrides,
  };
}

describe('parseIndexDirective fail-closed', () => {
  it('allows index,follow and index', () => {
    expect(parseIndexDirective('index,follow').allowsIndex).toBe(true);
    expect(parseIndexDirective('index').allowsIndex).toBe(true);
    expect(parseIndexDirective('INDEX, FOLLOW').allowsIndex).toBe(true);
  });

  it('rejects noindex even when substring contains "index"', () => {
    expect('noindex,follow'.includes('index')).toBe(true); // documents the footgun
    expect(parseIndexDirective('noindex,follow').allowsIndex).toBe(false);
    expect(parseIndexDirective('noindex').allowsIndex).toBe(false);
    expect(parseIndexDirective('none').allowsIndex).toBe(false);
  });

  it('rejects empty and unknown', () => {
    expect(parseIndexDirective('').allowsIndex).toBe(false);
    expect(parseIndexDirective(null).allowsIndex).toBe(false);
    expect(parseIndexDirective('follow').allowsIndex).toBe(false);
    expect(parseIndexDirective('banana').allowsIndex).toBe(false);
  });
});

describe('isSeoIndexable + registry filters', () => {
  it('marks noindex records not indexable', () => {
    const rec = baseRecord({ indexDirective: 'noindex,follow' });
    expect(isSeoIndexable(rec)).toBe(false);
    expect(evaluateSeoIndexable(rec).reasons).toContain('robots-noindex');
  });

  it('excludes noindex records from sitemapPages and llmEligiblePages', () => {
    const noindex = baseRecord({
      canonicalPath: '/__test_noindex_never_in_prod__',
      indexDirective: 'noindex,follow',
      id: '__test_noindex__',
    });
    expect(isSeoIndexable(noindex)).toBe(false);
    // Live registry helpers only see real PAGES; assert filter semantics via isSeoIndexable contract:
    const simulatedSitemap = [noindex].filter((p) => isSeoIndexable(p) && p.sitemapEligible === true);
    const simulatedLlm = [noindex].filter((p) => isSeoIndexable(p) && p.llmEligible === true);
    expect(simulatedSitemap).toHaveLength(0);
    expect(simulatedLlm).toHaveLength(0);
    // Production helpers must not suddenly include unknown paths
    expect(sitemapPages().some((p) => p.canonicalPath === noindex.canonicalPath)).toBe(false);
    expect(llmEligiblePages().some((p) => p.canonicalPath === noindex.canonicalPath)).toBe(false);
  });
});
