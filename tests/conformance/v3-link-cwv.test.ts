import { describe, expect, it } from 'vitest';
import { assertAnchorQuality, evaluateCwv, findOrphans } from '../../scripts/seo/link-cwv-contract.ts';

describe('SEO V3 Phase 7 link/CWV', () => {
  it('detects unreachable internal pages', () => {
    expect(findOrphans([
      { path: '/', links: ['/tools.html'] },
      { path: '/tools.html', links: ['/calculator/oee-teep'] },
      { path: '/calculator/oee-teep', links: [] },
      { path: '/orphan', links: [] },
    ], ['/'])).toEqual(['/orphan']);
  });

  it('does not invent a CWV pass when field observations are missing', () => {
    expect(evaluateCwv({}, { lcpP75Ms: 2500, inpP75Ms: 200, clsP75: 0.1 }).status).toBe('SKIP_NO_DATA');
  });

  it('uses supplied thresholds and fails observed regressions', () => {
    expect(evaluateCwv(
      { lcpP75Ms: 2600, inpP75Ms: 150, clsP75: 0.05 },
      { lcpP75Ms: 2500, inpP75Ms: 200, clsP75: 0.1 },
    )).toEqual({ status: 'FAIL', failures: ['LCP'] });
  });

  it('blocks generic anchors', () => {
    expect(() => assertAnchorQuality('click here')).toThrow(/GENERIC_ANCHOR/);
    expect(() => assertAnchorQuality('calculate machine hourly rate')).not.toThrow();
  });
});
