import { describe, expect, it } from 'vitest';
import { validateTamLoops } from '../../scripts/seo/tam-loop-contract';

const config = { thresholds: { lcpP75Ms: 2500, inpP75Ms: 200, clsP75: 0.1 } };
const base = () => ({ id: 'loop-1', enabled: true, claimEnabled: false, evidenceRef: null as string | null, owner: 'growth', requiresModeration: false, moderationEnabled: false, channel: 'organic' as 'organic' | 'paid' | 'mixed' | 'affiliate' | 'ugc', cwvBudgetRefs: [] as string[], observationWindowDeclared: true, affiliateDisclosureAudited: true });

describe('phase 16 TAM/growth-loop code contract', () => {
  it('accepts no active loops', () => expect(validateTamLoops({ loops: [] }, config).errors).toEqual([]));
  it('blocks claims without evidence', () => { const l = base(); l.claimEnabled = true; expect(validateTamLoops({ loops: [l] }, config).errors.join(' ')).toContain('INV-16.1'); });
  it('blocks unmoderated UGC', () => { const l = base(); l.channel = 'ugc'; l.requiresModeration = true; expect(validateTamLoops({ loops: [l] }, config).errors.join(' ')).toContain('INV-16.3'); });
  it('blocks paid loops without all config CWV refs', () => { const l = base(); l.channel = 'paid'; l.cwvBudgetRefs = ['thresholds.lcpP75Ms']; expect(validateTamLoops({ loops: [l] }, config).errors.join(' ')).toContain('INV-16.4'); });
  it('accepts paid loops with all config CWV refs', () => { const l = base(); l.channel = 'paid'; l.cwvBudgetRefs = ['thresholds.lcpP75Ms','thresholds.inpP75Ms','thresholds.clsP75']; expect(validateTamLoops({ loops: [l] }, config).errors).toEqual([]); });
  it('warns when enabled loop lacks owner/window', () => { const l = base(); l.owner = null; l.observationWindowDeclared = false; const r = validateTamLoops({ loops: [l] }, config); expect(r.warnings.join(' ')).toContain('INV-16.2'); expect(r.warnings.join(' ')).toContain('INV-16.5'); });
});
