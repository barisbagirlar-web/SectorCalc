import { describe, expect, it } from 'vitest';
import { validateOffpage, type OffpagePlan } from '../../scripts/seo/offpage-contract';

const config = { thresholds: { brandSerpOwnershipWarnPct: 70 } };
const base = (): OffpagePlan => ({ disavow: false, manualAction: false, provenNegativeSeo: false, approvalRef: null, tactics: [], prCampaign: false, linkableAssetReady: false, brandDemandMixedWithGeneric: false, brandSerpOwnershipPct: null, aiCitationMethodologyDeclared: true });

describe('phase 13 off-page code contract', () => {
  it('accepts a safe code-only plan', () => expect(validateOffpage(base(), '', config).errors).toEqual([]));
  it('blocks unconditional disavow', () => { const p = base(); p.disavow = true; expect(validateOffpage(p, '', config).errors.join(' ')).toContain('INV-13.1'); });
  it('allows evidence-backed approved disavow', () => { const p = base(); p.disavow = true; p.provenNegativeSeo = true; p.approvalRef = 'DEC-13'; expect(validateOffpage(p, 'DEC-13', config).errors).toEqual([]); });
  it('blocks link schemes', () => { const p = base(); p.tactics = ['paid-link', 'pbn']; expect(validateOffpage(p, '', config).errors.join(' ')).toContain('INV-13.2'); });
  it('warns when PR has no linkable asset', () => { const p = base(); p.prCampaign = true; expect(validateOffpage(p, '', config).warnings.join(' ')).toContain('INV-13.3'); });
  it('warns when measured brand SERP ownership is below config', () => { const p = base(); p.brandSerpOwnershipPct = 69; expect(validateOffpage(p, '', config).warnings.join(' ')).toContain('INV-13.5'); });
  it('does not invent a brand SERP warning when measurement is absent', () => expect(validateOffpage(base(), '', config).warnings.join(' ')).not.toContain('INV-13.5'));
});
