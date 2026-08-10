import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { assertAnchorQuality, cwvThresholdsFromConfig, evaluateCwv, findOrphans } from '../../scripts/seo/link-cwv-contract.ts';

const config = JSON.parse(readFileSync('sites/sectorcalc/seo.config.json', 'utf8'));

describe('SEO V3 Phase 7 link/CWV', () => {
  it('detects unreachable internal pages', () => {
    expect(findOrphans([
      { path: '/', links: ['/tools.html'] },
      { path: '/tools.html', links: ['/calculator/oee-teep'] },
      { path: '/calculator/oee-teep', links: [] },
      { path: '/orphan', links: [] },
    ], ['/'])).toEqual(['/orphan']);
  });

  it('loads CWV thresholds from the config SSOT', () => {
    expect(cwvThresholdsFromConfig(config)).toEqual({
      lcpP75Ms: config.thresholds.lcpP75Ms,
      inpP75Ms: config.thresholds.inpP75Ms,
      clsP75: config.thresholds.clsP75,
    });
    expect(() => cwvThresholdsFromConfig({ thresholds: {} })).toThrow(/CWV_THRESHOLDS_CONFIG_INVALID/);
  });

  it('does not invent a CWV pass when field observations are missing', () => {
    expect(evaluateCwv({}, cwvThresholdsFromConfig(config)).status).toBe('SKIP_NO_DATA');
  });

  it('fails observed regressions against supplied thresholds', () => {
    const thresholds = cwvThresholdsFromConfig(config);
    expect(evaluateCwv(
      { lcpP75Ms: thresholds.lcpP75Ms + 1, inpP75Ms: thresholds.inpP75Ms, clsP75: thresholds.clsP75 },
      thresholds,
    )).toEqual({ status: 'FAIL', failures: ['LCP'] });
  });

  it('blocks generic anchors while allowing descriptive anchors', () => {
    expect(() => assertAnchorQuality('click here')).toThrow(/GENERIC_ANCHOR/);
    expect(() => assertAnchorQuality('calculate machine hourly rate')).not.toThrow();
  });
});
