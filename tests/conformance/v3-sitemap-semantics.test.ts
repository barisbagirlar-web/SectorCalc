import { describe, expect, it } from 'vitest';
import {
  buildSitemapArtifacts,
  canonicalEntry,
  DEFAULT_SITEMAP_LIMITS,
  normalizeReliableLastmod,
  renderImageUrlset,
  renderUrlset,
  sha256
} from '../../seo/sitemap-engine.mjs';
import { SITEMAP_POLICY, SITEMAP_RETAINED_FRACTION } from '../../seo/sitemap-policy.mjs';
import { pageState, PAGE_STATES } from '../../seo/page-state.mjs';

describe('SEO V3 phase 3 sitemap semantics', () => {
  const base = [
    { loc: 'https://sectorcalc.com/', lastmod: null },
    { loc: 'https://sectorcalc.com/calculator/a', lastmod: null }
  ];

  it('is deterministic and omits priority/changefreq/build metadata', () => {
    const a = renderUrlset([...base].reverse());
    const b = renderUrlset(base);
    expect(a).toBe(b);
    expect(sha256(a)).toBe(sha256(b));
    expect(a).not.toMatch(/<priority>|<changefreq>|generator|build[- ]?time/i);
  });

  it('detects add/remove changes by content hash', () => {
    const before = renderUrlset(base);
    const added = renderUrlset([
      ...base,
      { loc: 'https://sectorcalc.com/calculator/b', lastmod: null }
    ]);
    const removed = renderUrlset(base.slice(0, 1));
    expect(sha256(added)).not.toBe(sha256(before));
    expect(sha256(removed)).not.toBe(sha256(before));
  });

  it('uses config as the default chunk and shrink policy SSOT', () => {
    expect(DEFAULT_SITEMAP_LIMITS).toEqual({
      maxUrls: SITEMAP_POLICY.maxUrls,
      maxBytes: SITEMAP_POLICY.maxBytes
    });
    expect(SITEMAP_RETAINED_FRACTION).toBe((100 - SITEMAP_POLICY.maxShrinkPct) / 100);
  });

  it('rolls over chunks instead of throwing at the configured ceiling', () => {
    const entries = Array.from({ length: 5 }, (_, i) => ({
      loc: `https://sectorcalc.com/p/${i}`,
      lastmod: null
    }));
    const built = buildSitemapArtifacts(entries, 'https://sectorcalc.com', {
      maxUrls: 2,
      maxBytes: 1000000
    });
    expect(built.files).toHaveLength(3);
    expect(built.index).not.toBeNull();
    expect(built.files.every((f) => f.count <= 2)).toBe(true);
  });

  it('fails closed on invalid chunk limits', () => {
    expect(() =>
      buildSitemapArtifacts(base, 'https://sectorcalc.com', { maxUrls: 0, maxBytes: 1000 })
    ).toThrow('INVALID_SITEMAP_LIMITS');
  });

  it('omits unreliable lastmod and caps future reliable timestamps', () => {
    expect(normalizeReliableLastmod('not-a-date', new Date('2026-08-10T00:00:00Z'))).toBeNull();
    expect(normalizeReliableLastmod('2027-01-01T00:00:00Z', new Date('2026-08-10T00:00:00Z'))).toBe(
      '2026-08-10T00:00:00.000Z'
    );
    expect(
      canonicalEntry(
        { canonicalPath: '/x' },
        'https://sectorcalc.com',
        new Date('2026-08-10T00:00:00Z')
      ).lastmod
    ).toBeNull();
  });

  it('renders image sitemap only for real image locs', () => {
    const xml = renderImageUrlset([
      {
        loc: 'https://sectorcalc.com/',
        images: [
          { loc: 'https://sectorcalc.com/assets/images/og-home-1200x630.jpg', title: 'Home OG' }
        ]
      }
    ]);
    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    expect(xml).toContain(
      '<image:loc>https://sectorcalc.com/assets/images/og-home-1200x630.jpg</image:loc>'
    );
    expect(xml).not.toMatch(/<priority>|<changefreq>/i);
    expect(() => renderImageUrlset([])).toThrow('EMPTY_IMAGE_SITEMAP');
  });

  it('rejects dirty canonical query parameters and duplicate URLs', () => {
    expect(() =>
      canonicalEntry({ canonicalPath: '/x?utm_source=a' }, 'https://sectorcalc.com', new Date())
    ).toThrow();
    expect(() => buildSitemapArtifacts([base[0], base[0]], 'https://sectorcalc.com')).toThrow(
      'DUPLICATE_SITEMAP_URL'
    );
  });

  it('maps publication/indexability to one page state', () => {
    expect(pageState({ publicationStatus: 'draft' })).toBe(PAGE_STATES.DRAFT);
    expect(
      pageState({
        publicationStatus: 'published',
        indexDirective: 'noindex',
        canonicalPath: '/x',
        quality: {}
      })
    ).toBe(PAGE_STATES.PUBLISHED_NOINDEX);
    expect(pageState({ publicationStatus: 'gone', httpStatus: 410 })).toBe(PAGE_STATES.GONE);
  });
});
