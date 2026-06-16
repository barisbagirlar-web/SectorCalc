// Auto-generated from dps-calculator-schema.json
import * as z from 'zod';

export interface Dps_calculatorInput {
  dividendsTotal: number;
  sharesOutstanding: number;
  netIncome: number;
  payoutRatio: number;
}

export const Dps_calculatorInputSchema = z.object({
  dividendsTotal: z.number().default(100000),
  sharesOutstanding: z.number().default(10000),
  netIncome: z.number().default(200000),
  payoutRatio: z.number().default(50),
});

function evaluateAllFormulas(input: Dps_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sharesOutstanding !== 0 ? input.dividendsTotal / input.sharesOutstanding : 0; results["dps"] = Number.isFinite(v) ? v : 0; } catch { results["dps"] = 0; }
  try { const v = input.netIncome !== 0 ? (input.dividendsTotal / input.netIncome) * 100 : 0; results["payoutRatioCalculated"] = Number.isFinite(v) ? v : 0; } catch { results["payoutRatioCalculated"] = 0; }
  try { const v = input.sharesOutstanding !== 0 ? (input.netIncome * (input.payoutRatio / 100)) / input.sharesOutstanding : 0; results["dpsFromPayout"] = Number.isFinite(v) ? v : 0; } catch { results["dpsFromPayout"] = 0; }
  return results;
}


export function calculateDps_calculator(input: Dps_calculatorInput): Dps_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dps"] ?? 0;
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


export interface Dps_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
