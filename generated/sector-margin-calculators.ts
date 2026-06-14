// Auto-generated from sector-margin-calculators-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SectorMarginCalculatorsInput {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  otherIncome: number;
  otherExpenses: number;
  taxRate: number;
  periodDays: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const SectorMarginCalculatorsInputSchema = z.object({
  revenue: z.number().min(0).default(1000000),
  cogs: z.number().min(0).default(600000),
  operatingExpenses: z.number().min(0).default(200000),
  otherIncome: z.number().min(0).default(0),
  otherExpenses: z.number().min(0).default(0),
  taxRate: z.number().min(0).max(100).default(25),
  periodDays: z.number().min(1).max(365).default(365),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface SectorMarginCalculatorsOutput {
  netMargin: number;
  breakdown: {
    grossMargin: number;
    operatingMargin: number;
    preTaxMargin: number;
    netProfit: number;
    annualizedNetMargin: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SectorMarginCalculatorsInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.grossProfit = ((): number => { try { const __v = input.revenue - input.cogs; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossMargin = ((): number => { try { const __v = results.grossProfit / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.operatingProfit = ((): number => { try { const __v = results.grossProfit - input.operatingExpenses; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.operatingMargin = ((): number => { try { const __v = results.operatingProfit / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.preTaxProfit = ((): number => { try { const __v = results.operatingProfit + input.otherIncome - input.otherExpenses; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.preTaxMargin = ((): number => { try { const __v = results.preTaxProfit / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfit = ((): number => { try { const __v = results.preTaxProfit * (1 - input.taxRate/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netMargin = ((): number => { try { const __v = results.netProfit / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualizedNetMargin = ((): number => { try { const __v = results.netMargin * (365 / input.periodDays); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSectorMarginCalculators(input: SectorMarginCalculatorsInput): SectorMarginCalculatorsOutput {
  const results = evaluateFormulas(input);
  const netMargin = results.netMargin ?? 0;
  const breakdown = {
    grossMargin: results.grossMargin,
    operatingMargin: results.operatingMargin,
    preTaxMargin: results.preTaxMargin,
    netProfit: results.netProfit,
    annualizedNetMargin: results.annualizedNetMargin,
  };

  // rule: revenue >= 0
  // rule: cogs >= 0
  // rule: operatingExpenses >= 0
  // rule: otherIncome >= 0
  // rule: otherExpenses >= 0
  // rule: taxRate >= 0 and taxRate <= 100
  // rule: periodDays >= 1 and periodDays <= 365
  // rule: cogs <= revenue (if revenue > 0)
  // rule: operatingExpenses <= revenue (if revenue > 0)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): grossMargin
  // threshold skipped (non-string): operatingMargin
  // threshold skipped (non-string): netMargin

  const dataConfidenceAdjusted = (() => { try { return netMargin; } catch { return netMargin; } })();

  return {
    netMargin,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (multi-period)","Benchmark Comparison (industry averages)","Detailed Report with charts"],
  };
}
