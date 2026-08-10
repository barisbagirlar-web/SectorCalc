import { describe, expect, it } from 'vitest';
import { validateKac } from '../../scripts/seo/kac-contract';

const config = { site: { maxConcurrentKacActions: 3 }, thresholds: { similarityMax: 0.85, divestPendingMaxDays: 30 } };
const base = () => ({ partial: false, activeActions: 1, issueStateSeparation: true, openFormulaRecord: true, clusters: [{ clusterId: 'c1', primaryQuery: 'cnc cost calculator', ownerRoute: '/calculator/cnc', sourceCtrModel: 'first-party', similarityToExisting: 0.4, portfolioRecommendation: null as null | 'INVEST' | 'HOLD' | 'HARVEST' | 'DIVEST', decisionEligible: true, approvalRef: null as string | null, decisionAt: null as string | null }] });

describe('phase 11 KAC code contract', () => {
  it('accepts a safe code-only artifact', () => {
    expect(validateKac(base(), config, '').errors).toEqual([]);
  });
  it('blocks multiple owners for one query', () => {
    const a = base();
    a.clusters.push({ ...a.clusters[0], clusterId: 'c2', ownerRoute: '/calculator/other' });
    expect(validateKac(a, config, '').errors.join(' ')).toContain('INV-11.1');
  });
  it('blocks industry CTR models', () => {
    const a = base(); a.clusters[0].sourceCtrModel = 'industry-table';
    expect(validateKac(a, config, '').errors.join(' ')).toContain('INV-11.2');
  });
  it('blocks similarity overflow', () => {
    const a = base(); a.clusters[0].similarityToExisting = 0.86;
    expect(validateKac(a, config, '').errors.join(' ')).toContain('INV-11.3');
  });
  it('blocks decisions without ledger approval', () => {
    const a = base(); a.clusters[0].portfolioRecommendation = 'HOLD'; a.clusters[0].approvalRef = 'DEC-1';
    expect(validateKac(a, config, '').errors.join(' ')).toContain('INV-11.4');
  });
  it('blocks INVEST on partial evidence', () => {
    const a = base(); a.partial = true; a.clusters[0].portfolioRecommendation = 'INVEST'; a.clusters[0].approvalRef = 'DEC-1';
    expect(validateKac(a, config, 'DEC-1').errors.join(' ')).toContain('INV-11.6');
  });
  it('enforces configured concurrency', () => {
    const a = base(); a.activeActions = 4;
    expect(validateKac(a, config, '').errors.join(' ')).toContain('KAC_CONCURRENCY_EXCEEDED');
  });
});
