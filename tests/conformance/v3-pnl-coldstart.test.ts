import { describe, expect, it } from 'vitest';
import { assertStructuralBreakSafe, validateColdStartPnl } from '../../scripts/seo/pnl-coldstart.ts';

function artifact() {
  return {
    meta: {
      artifact: 'seo-pnl', schemaVersion: '1.0', generatedAt: '2026-08-10T12:30:00Z', generatorScript: 'scripts/seo/pnl-coldstart.ts',
      inputWindow: { start: null, end: null, observedDays: 0 }, confidence: 'low', partial: true, siteId: 'sectorcalc', coldStart: true, structuralBreaksApplied: [],
    },
    measurementAvailable: false,
    economics: { defaultValuePerConversionMinor: '0' },
    incrementality: { status: 'SKIP_NO_DATA', claimPublished: false },
    generativeAi: { includedInRevenueFormula: false },
  };
}

describe('SEO V3 Phase 9 P&L cold-start', () => {
  it('accepts an evidence-safe cold-start artifact', () => {
    expect(validateColdStartPnl(artifact(), 28)).toEqual([]);
  });

  it('blocks floating point money', () => {
    const value = artifact() as ReturnType<typeof artifact> & { spendMinor?: number };
    value.spendMinor = 12.5;
    expect(validateColdStartPnl(value, 28).some((error) => error.includes('spendMinor'))).toBe(true);
  });

  it('blocks effect claims without verified measurement', () => {
    const value = artifact();
    value.incrementality.claimPublished = true;
    expect(validateColdStartPnl(value, 28)).toContain('incrementality-without-data');
  });

  it('blocks joins that cross an undeclared structural break', () => {
    expect(() => assertStructuralBreakSafe(artifact(), [{ date: '2025-09-10' }, { date: '2025-09-12' }], '2025-09-11')).toThrow(/STRUCTURAL_BREAK_JOIN_BLOCK/);
  });
});
