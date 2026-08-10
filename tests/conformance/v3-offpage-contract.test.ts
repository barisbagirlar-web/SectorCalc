import { describe, expect, it } from 'vitest';
import { validateOffpage, type OffpagePlan } from '../../scripts/seo/offpage-contract';

const base = (): OffpagePlan => ({ disavow: false, manualAction: false, provenNegativeSeo: false, approvalRef: null, tactics: [], prCampaign: false, linkableAssetReady: false, brandDemandMixedWithGeneric: false, aiCitationMethodologyDeclared: true });

describe('phase 13 off-page code contract', () => {
  it('accepts a safe code-only plan', () => {
    expect(validateOffpage(base(), '').errors).toEqual([]);
  });
  it('blocks unconditional disavow', () => {
    const p = base(); p.disavow = true;
    expect(validateOffpage(p, '').errors.join(' ')).toContain('INV-13.1');
  });
  it('allows evidence-backed approved disavow', () => {
    const p = base(); p.disavow = true; p.provenNegativeSeo = true; p.approvalRef = 'DEC-13';
    expect(validateOffpage(p, 'DEC-13').errors).toEqual([]);
  });
  it('blocks link schemes', () => {
    const p = base(); p.tactics = ['paid-link', 'pbn'];
    expect(validateOffpage(p, '').errors.join(' ')).toContain('INV-13.2');
  });
  it('warns when PR has no linkable asset', () => {
    const p = base(); p.prCampaign = true;
    expect(validateOffpage(p, '').warnings.join(' ')).toContain('INV-13.3');
  });
});
