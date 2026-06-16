// Auto-generated from discounted-payback-period-schema.json
import * as z from 'zod';

export interface Discounted_payback_periodInput {
  initialInvestment: number;
  discountRate: number;
  cashFlowYear1: number;
  cashFlowYear2: number;
  cashFlowYear3: number;
  cashFlowYear4: number;
  cashFlowYear5: number;
}

export const Discounted_payback_periodInputSchema = z.object({
  initialInvestment: z.number().default(50000),
  discountRate: z.number().default(8),
  cashFlowYear1: z.number().default(10000),
  cashFlowYear2: z.number().default(20000),
  cashFlowYear3: z.number().default(30000),
  cashFlowYear4: z.number().default(40000),
  cashFlowYear5: z.number().default(50000),
});

function evaluateAllFormulas(input: Discounted_payback_periodInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cashFlowYear1 / (1 + input.discountRate/100) ** 1; results["dcf1"] = Number.isFinite(v) ? v : 0; } catch { results["dcf1"] = 0; }
  try { const v = input.cashFlowYear2 / (1 + input.discountRate/100) ** 2; results["dcf2"] = Number.isFinite(v) ? v : 0; } catch { results["dcf2"] = 0; }
  try { const v = input.cashFlowYear3 / (1 + input.discountRate/100) ** 3; results["dcf3"] = Number.isFinite(v) ? v : 0; } catch { results["dcf3"] = 0; }
  try { const v = input.cashFlowYear4 / (1 + input.discountRate/100) ** 4; results["dcf4"] = Number.isFinite(v) ? v : 0; } catch { results["dcf4"] = 0; }
  try { const v = input.cashFlowYear5 / (1 + input.discountRate/100) ** 5; results["dcf5"] = Number.isFinite(v) ? v : 0; } catch { results["dcf5"] = 0; }
  try { const v = -input.initialInvestment; results["cumulative0"] = Number.isFinite(v) ? v : 0; } catch { results["cumulative0"] = 0; }
  try { const v = (results["cumulative0"] ?? 0) + (results["dcf1"] ?? 0); results["cumulative1"] = Number.isFinite(v) ? v : 0; } catch { results["cumulative1"] = 0; }
  try { const v = (results["cumulative1"] ?? 0) + (results["dcf2"] ?? 0); results["cumulative2"] = Number.isFinite(v) ? v : 0; } catch { results["cumulative2"] = 0; }
  try { const v = (results["cumulative2"] ?? 0) + (results["dcf3"] ?? 0); results["cumulative3"] = Number.isFinite(v) ? v : 0; } catch { results["cumulative3"] = 0; }
  try { const v = (results["cumulative3"] ?? 0) + (results["dcf4"] ?? 0); results["cumulative4"] = Number.isFinite(v) ? v : 0; } catch { results["cumulative4"] = 0; }
  try { const v = (results["cumulative4"] ?? 0) + (results["dcf5"] ?? 0); results["cumulative5"] = Number.isFinite(v) ? v : 0; } catch { results["cumulative5"] = 0; }
  try { const v = (results["cumulative1"] ?? 0) >= 0 ? input.initialInvestment / (results["dcf1"] ?? 0) : (results["cumulative2"] ?? 0) >= 0 ? 1 + Math.abs((results["cumulative1"] ?? 0)) / (results["dcf2"] ?? 0) : (results["cumulative3"] ?? 0) >= 0 ? 2 + Math.abs((results["cumulative2"] ?? 0)) / (results["dcf3"] ?? 0) : (results["cumulative4"] ?? 0) >= 0 ? 3 + Math.abs((results["cumulative3"] ?? 0)) / (results["dcf4"] ?? 0) : (results["cumulative5"] ?? 0) >= 0 ? 4 + Math.abs((results["cumulative4"] ?? 0)) / (results["dcf5"] ?? 0) : null; results["discountedPayback"] = Number.isFinite(v) ? v : 0; } catch { results["discountedPayback"] = 0; }
  return results;
}


export function calculateDiscounted_payback_period(input: Discounted_payback_periodInput): Discounted_payback_periodOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["discountedPayback"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Discounted_payback_periodOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
