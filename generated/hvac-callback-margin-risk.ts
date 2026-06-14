// Auto-generated from hvac-callback-margin-risk-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HvacCallbackMarginRiskInput {
  annualServiceRevenue: number;
  callbackRate: number;
  avgCallbackCost: number;
  warrantyPeriodMonths: number;
  dataConfidence: 'low' | 'medium' | 'high';
  includeHiddenCosts: boolean;
}

export const HvacCallbackMarginRiskInputSchema = z.object({
  annualServiceRevenue: z.number().min(0).default(1000000),
  callbackRate: z.number().min(0).max(100).default(5),
  avgCallbackCost: z.number().min(0).default(250),
  warrantyPeriodMonths: z.number().min(0).max(60).default(12),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
  includeHiddenCosts: z.boolean().default(false),
});

export interface HvacCallbackMarginRiskOutput {
  finalMarginRisk: number;
  breakdown: {
    totalCallbacks: number;
    annualCallbackCost: number;
    marginRisk: number;
    adjustedMarginRisk: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HvacCallbackMarginRiskInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalCallbacks = ((): number => { try { const __v = input.annualServiceRevenue * (input.callbackRate / 100) / input.avgCallbackCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualCallbackCost = ((): number => { try { const __v = results.totalCallbacks * input.avgCallbackCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginRisk = ((): number => { try { const __v = results.annualCallbackCost / input.annualServiceRevenue * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hiddenCostMultiplier = ((): number => { try { const __v = input.includeHiddenCosts ? 1.5 : 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedMarginRisk = ((): number => { try { const __v = results.marginRisk * results.hiddenCostMultiplier; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceFactor = ((): number => { try { const __v = input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.8); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finalMarginRisk = ((): number => { try { const __v = results.adjustedMarginRisk * results.dataConfidenceFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHvacCallbackMarginRisk(input: HvacCallbackMarginRiskInput): HvacCallbackMarginRiskOutput {
  const results = evaluateFormulas(input);
  const finalMarginRisk = results.finalMarginRisk ?? 0;
  const breakdown = {
    totalCallbacks: results.totalCallbacks,
    annualCallbackCost: results.annualCallbackCost,
    marginRisk: results.marginRisk,
    adjustedMarginRisk: results.adjustedMarginRisk,
  };

  // rule: annualServiceRevenue > 0
  // rule: callbackRate >= 0 and callbackRate <= 100
  // rule: avgCallbackCost >= 0
  // rule: warrantyPeriodMonths >= 0 and warrantyPeriodMonths <= 60
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High callback rate indicates systemic quality issues. Consider root cause analysis.
  // threshold skipped (non-JS): Critical callback rate. Immediate action required to avoid contract penalties.

  const dataConfidenceAdjusted = (() => { try { return results.finalMarginRisk; } catch { return finalMarginRisk; } })();

  return {
    finalMarginRisk,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against industry averages","Detailed breakdown report with charts"],
  };
}
