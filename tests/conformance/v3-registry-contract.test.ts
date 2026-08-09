import { describe, expect, it } from 'vitest';
import {
  assertNoindexNotInSitemap,
  assertNotFuture,
  normalizeIndexDirective,
  validateCurrentRegistry,
} from '../../scripts/validate-registry.ts';

describe('SEO V3 Phase 1 registry contract', () => {
  it('adapts and validates the current registry SSOT', () => {
    const records = validateCurrentRegistry();
    expect(records.length).toBeGreaterThan(0);
    for (const record of records) {
      expect(record.route.startsWith('/')).toBe(true);
      expect(record.canonicalRoute.startsWith('/')).toBe(true);
      expect(record.richResultTypes.length).toBeGreaterThan(0);
      expect(new Date(record.modifiedAt).getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  it('fails a future modifiedAt', () => {
    expect(() => assertNotFuture('2099-01-01T00:00:00.000Z', new Date('2026-08-10T00:00:00.000Z'))).toThrow(/future modifiedAt/);
  });

  it('fails a noindex route present in sitemap', () => {
    expect(() => assertNoindexNotInSitemap(
      [{ canonicalRoute: '/private', indexDirective: 'noindex' }],
      ['/private'],
    )).toThrow(/noindex route leaked into sitemap/);
  });

  it('parses noindex without substring mistakes', () => {
    expect(normalizeIndexDirective('noindex,follow')).toBe('noindex');
    expect(normalizeIndexDirective('index,follow')).toBe('index');
    expect(() => normalizeIndexDirective('follow')).toThrow(/unknown index directive/);
  });
});
