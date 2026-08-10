import { describe, expect, it } from 'vitest';
import { assertSimilarityBelow, assertSingleQueryOwner, jaccardSimilarity } from '../../scripts/seo/content-entity-audit.ts';

describe('SEO V3 Phase 5 content/entity governance', () => {
  it('blocks near-duplicate content above configured threshold', () => {
    const source = 'machine hourly rate calculator includes depreciation maintenance power overhead setup programming manufacturing cost';
    const copy = 'machine hourly rate calculator includes depreciation maintenance power overhead setup programming manufacturing cost';
    expect(jaccardSimilarity(source, copy)).toBe(1);
    expect(() => assertSimilarityBelow(source, copy, 0.85)).toThrow(/CONTENT_SIMILARITY_BLOCK/);
  });

  it('allows genuinely differentiated copy', () => {
    expect(() => assertSimilarityBelow(
      'calculate machine hourly rate from depreciation maintenance energy and factory overhead',
      'estimate bearing l10 fatigue life from dynamic load rating equivalent load and shaft speed',
      0.85,
    )).not.toThrow();
  });

  it('blocks duplicate primary query ownership', () => {
    expect(() => assertSingleQueryOwner([
      { primaryQuery: 'oee calculator', owner: '/calculator/oee-teep' },
      { primaryQuery: 'OEE calculator', owner: '/guides/oee' },
    ])).toThrow(/DUPLICATE_PRIMARY_QUERY_OWNER/);
  });
});
