import { describe, expect, it } from 'vitest';
import { validateDdManifest, validateValuation } from '../../scripts/seo/valuation-contract';

const config = { economics: { valuationMultiples: { low: 2, high: 4 } } };
const method = (status: 'DORMANT' | 'READY' | 'CALCULATED' = 'DORMANT') => ({ status, methodology: null as string | null, multipleLow: null as number | null, multipleHigh: null as number | null, rangeMinor: null as [number, number] | null, historyMonths: 0 });
const base = () => ({ singleValueClaimMinor: null as number | null, methods: { V1: method(), V2: method(), V3: method() }, managementReportTemplatePresent: true });
const allRoles = ['registry_export', 'pnl_raw_series', 'redirect_ledger', 'decision_ledger', 'conformance_history', 'structural_breaks'];

describe('phase 19 valuation code contract', () => {
  it('accepts dormant valuation without fabricated claims', () => expect(validateValuation(base(), config).errors).toEqual([]));
  it('blocks claims without methodology and range', () => { const v = base(); v.singleValueClaimMinor = 100; expect(validateValuation(v, config).errors.join(' ')).toContain('INV-19.1'); });
  it('blocks calculated V1 with config-divergent multiples', () => { const v = base(); v.methods.V1 = { status: 'CALCULATED', methodology: 'revenue multiple', multipleLow: 1, multipleHigh: 3, rangeMinor: [100, 300], historyMonths: 12 }; expect(validateValuation(v, config).errors.join(' ')).toContain('INV-19.1'); });
  it('accepts calculated V1 with configured range', () => { const v = base(); v.methods.V1 = { status: 'CALCULATED', methodology: 'revenue multiple', multipleLow: 2, multipleHigh: 4, rangeMinor: [200, 400], historyMonths: 12 }; expect(validateValuation(v, config).errors).toEqual([]); });
  it('warns when management report template is absent', () => { const v = base(); v.managementReportTemplatePresent = false; expect(validateValuation(v, config).warnings.join(' ')).toContain('INV-19.2'); });
  it('blocks incomplete DD manifest', () => expect(validateDdManifest(allRoles.filter((r) => r !== 'decision_ledger')).join(' ')).toContain('INV-19.3'));
  it('reports V3 history shorter than twelve months without fabricating data', () => { const v = base(); v.methods.V3 = { status: 'CALCULATED', methodology: 'cashflow', multipleLow: null, multipleHigh: null, rangeMinor: [100, 200], historyMonths: 11 }; expect(validateValuation(v, config).infos.join(' ')).toContain('INV-19.4'); });
});
