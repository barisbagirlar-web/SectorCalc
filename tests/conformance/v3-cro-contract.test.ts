import { describe, expect, it } from 'vitest';
import { validateCro } from '../../scripts/seo/cro-contract';

const config = { thresholds: { intentScoreMin: 4 } };
const base = () => ({ id: 'exp-1', active: true, intent: [7, 6, 6], primaryMetric: 'purchase', guardrails: ['refund'], samplePlan: 'fixed-horizon', mde: 'declared', decisionRule: 'pre-registered', minFullWeeks: 2, observedFullWeeks: 2, peeked: false, variantIndexable: false, variantCanonicalToControl: true, consentFresh: true });

describe('phase 14 CRO code contract', () => {
  it('accepts no active experiments', () => expect(validateCro({ experiments: [] }, config).errors).toEqual([]));
  it('blocks low intent', () => { const e = base(); e.intent = [1, 1, 1]; expect(validateCro({ experiments: [e] }, config).errors.join(' ')).toContain('INV-14.1'); });
  it('blocks incomplete preregistration', () => { const e = base(); e.primaryMetric = null; expect(validateCro({ experiments: [e] }, config).errors.join(' ')).toContain('INV-14.2'); });
  it('blocks peeking', () => { const e = base(); e.peeked = true; expect(validateCro({ experiments: [e] }, config).errors.join(' ')).toContain('INV-14.3'); });
  it('blocks indexable variants', () => { const e = base(); e.variantIndexable = true; expect(validateCro({ experiments: [e] }, config).errors.join(' ')).toContain('INV-14.4'); });
  it('warns on stale consent state', () => { const e = base(); e.consentFresh = false; expect(validateCro({ experiments: [e] }, config).warnings.join(' ')).toContain('INV-14.5'); });
  it('reports minimum duration without blocking', () => { const e = base(); e.observedFullWeeks = 1; const r = validateCro({ experiments: [e] }, config); expect(r.errors).toEqual([]); expect(r.infos.join(' ')).toContain('INV-14.6'); });
});
