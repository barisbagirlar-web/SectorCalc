import { describe, expect, it } from 'vitest';
import { validatePortfolio } from '../../scripts/seo/portfolio-contract';

const split = { investPct: 50, holdPct: 30, harvestPct: 15, divestPct: 5 };
const config = { thresholds: { concentrationWarnPct: 60 }, economics: { paybackMaxMonths: 12, budgetSplit: split } };
const base = () => ({ decision: null as null | 'INVEST' | 'HOLD' | 'HARVEST' | 'DIVEST', approvalRef: null as string | null, valueSharePct: 0, diversificationPlan: true, divestSteps: [false, false, false, false], proposedBudgetSplit: { ...split }, configChangeApproved: false, paybackMonths: null as number | null, paybackCalibrated: false, harvestInvestmentScanDone: false });

describe('phase 17 portfolio code contract', () => {
  it('accepts a neutral code-only portfolio state', () => expect(validatePortfolio(base(), config, '').errors).toEqual([]));
  it('blocks concentration without diversification', () => { const a = base(); a.valueSharePct = 61; a.diversificationPlan = false; expect(validatePortfolio(a, config, '').errors.join(' ')).toContain('INV-17.1'); });
  it('blocks incomplete DIVEST', () => { const a = base(); a.decision = 'DIVEST'; a.approvalRef = 'DEC-17'; a.divestSteps = [true, true, true, false]; expect(validatePortfolio(a, config, 'DEC-17').errors.join(' ')).toContain('INV-17.2'); });
  it('blocks unapproved budget deviation', () => { const a = base(); a.proposedBudgetSplit = { investPct: 55, holdPct: 25, harvestPct: 15, divestPct: 5 }; expect(validatePortfolio(a, config, '').errors.join(' ')).toContain('INV-17.3'); });
  it('blocks decisions without ledger approval', () => { const a = base(); a.decision = 'HOLD'; a.approvalRef = 'DEC-17'; expect(validatePortfolio(a, config, '').errors.join(' ')).toContain('INV-17.4'); });
  it('warns when payback exceeds config and is uncalibrated', () => { const a = base(); a.paybackMonths = 13; expect(validatePortfolio(a, config, '').warnings.join(' ')).toContain('INV-17.5'); });
});
