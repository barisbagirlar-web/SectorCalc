import { describe, expect, it } from 'vitest';
import { validateSlo } from '../../scripts/seo/slo-contract';

const config = { thresholds: { lcpP75Ms: 2500, inpP75Ms: 200, clsP75: 0.1 } };

describe('phase 12 SRE/SLO code contract', () => {
  it('accepts empty code-only evidence', () => {
    expect(validateSlo({ rows: [], assets: [] }, config).errors).toEqual([]);
  });
  it('blocks threshold breaches that are not marked failed', () => {
    const r = validateSlo({ rows: [{ id: 'lcp', measured: 2600, thresholdRef: 'thresholds.lcpP75Ms', status: 'PASS', issueOpened: false, consecutiveViolations: 1, freezeEscalated: false }], assets: [] }, config);
    expect(r.errors.join(' ')).toContain('INV-12.1');
  });
  it('blocks measured rows without config threshold references', () => {
    const r = validateSlo({ rows: [{ id: 'inp', measured: 150, thresholdRef: null, status: 'PASS', issueOpened: false, consecutiveViolations: 0, freezeEscalated: false }], assets: [] }, config);
    expect(r.errors.join(' ')).toContain('INV-12.2');
  });
  it('warns on repeated violations without freeze escalation', () => {
    const r = validateSlo({ rows: [{ id: 'cls', measured: 0.2, thresholdRef: 'thresholds.clsP75', status: 'FAIL', issueOpened: true, consecutiveViolations: 2, freezeEscalated: false }], assets: [] }, config);
    expect(r.warnings.join(' ')).toContain('INV-12.3');
  });
  it('blocks suspended assets that remain indexable', () => {
    const r = validateSlo({ rows: [], assets: [{ id: 'programmatic-batch', suspended: true, indexable: true }] }, config);
    expect(r.errors.join(' ')).toContain('INV-12.5');
  });
});
