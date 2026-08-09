import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CANONICAL_INVARIANT_CATALOG, EXIT, executeInvariantNegativeFixture, validateInvariantCatalog } from '../../seo/v6-conformance.mjs';

const registry = JSON.parse(readFileSync('data/seo/invariants.json', 'utf8'));
const blockIds = CANONICAL_INVARIANT_CATALOG.filter(([, severity]) => severity === 'BLOCK').map(([id]) => id);

describe('SEO V6 canonical invariant registry', () => {
  it('matches Appendix F exactly by ordered id and severity', () => {
    expect(CANONICAL_INVARIANT_CATALOG).toHaveLength(127);
    expect(registry.invariants).toHaveLength(127);
    expect(validateInvariantCatalog(registry)).toEqual([]);
  });

  it('contains the complete severity distribution', () => {
    expect(blockIds).toHaveLength(75);
    expect(CANONICAL_INVARIANT_CATALOG.filter(([, severity]) => severity === 'WARN')).toHaveLength(30);
    expect(CANONICAL_INVARIANT_CATALOG.filter(([, severity]) => severity === 'INFO')).toHaveLength(22);
  });

  for (const invariantId of blockIds) {
    it(`${invariantId} negative fixture returns exit 1`, () => {
      expect(executeInvariantNegativeFixture(registry, { invariantId, violates: true })).toBe(EXIT.VIOLATION);
      expect(executeInvariantNegativeFixture(registry, { invariantId, violates: false })).toBe(0);
    });
  }

  it('rejects unknown negative fixtures as configuration errors', () => {
    expect(executeInvariantNegativeFixture(registry, { invariantId: 'INV-UNKNOWN.1', violates: true })).toBe(EXIT.CONFIG);
  });
});
