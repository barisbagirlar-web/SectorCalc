import { describe, expect, it } from 'vitest';
import { validateVerticalActivation, validateVerticalFinding } from '../../scripts/seo/vertical-contract';

const config = { business: { verticals: ['saas'] }, thresholds: { similarityMax: 0.85 } };

describe('phase 15 vertical code contract', () => {
  it('accepts SectorCalc SaaS activation', () => expect(validateVerticalActivation(config)).toEqual([]));
  for (const [kind, invariant, value] of [
    ['ecom-oos-404', 'INV-15.1', undefined],
    ['ecom-indexed-variant', 'INV-15.2', undefined],
    ['local-nap-mismatch', 'INV-15.4', undefined],
    ['local-doorway', 'INV-15.5', 0.86],
    ['saas-js-methodology', 'INV-15.7', undefined],
    ['saas-false-offer', 'INV-15.8', undefined],
    ['news-old', 'INV-15.10', 49],
    ['hreflang-oneway', 'INV-15.13', undefined],
    ['xdefault-invalid', 'INV-15.14', undefined],
    ['ip-redirect', 'INV-15.15', undefined],
    ['hreflang-canonical-mismatch', 'INV-15.16', undefined],
    ['weaken-general-rule', 'INV-15.19', undefined],
  ] as const) {
    it(`blocks ${invariant}`, () => expect(validateVerticalFinding({ kind, value }, config).errors.join(' ')).toContain(invariant));
  }
  for (const [kind, invariant] of [
    ['ecom-schema-visible-mismatch', 'INV-15.3'],
    ['local-gbp-stale', 'INV-15.6'],
    ['saas-comparison-stale', 'INV-15.9'],
    ['media-author-policy-missing', 'INV-15.11'],
    ['i18n-human-edit-missing', 'INV-15.17'],
  ] as const) {
    it(`warns ${invariant}`, () => expect(validateVerticalFinding({ kind }, config).warnings.join(' ')).toContain(invariant));
  }
  for (const [kind, invariant] of [
    ['media-evergreen-registry-missing', 'INV-15.12'],
    ['out-of-module-unqueued', 'INV-15.18'],
  ] as const) {
    it(`reports ${invariant}`, () => expect(validateVerticalFinding({ kind }, config).infos.join(' ')).toContain(invariant));
  }
  it('does not flag local doorway below configured similarity threshold', () => expect(validateVerticalFinding({ kind: 'local-doorway', value: 0.8 }, config).errors).toEqual([]));
});
