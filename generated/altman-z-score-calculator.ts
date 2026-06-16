// Auto-generated from altman-z-score-calculator-schema.json
import * as z from 'zod';

export interface Altman_z_score_calculatorInput {
  workingCapital: number;
  totalAssets: number;
  retainedEarnings: number;
  ebit: number;
  marketValueEquity: number;
  totalLiabilities: number;
  sales: number;
}

export const Altman_z_score_calculatorInputSchema = z.object({
  workingCapital: z.number().default(0),
  totalAssets: z.number().default(0),
  retainedEarnings: z.number().default(0),
  ebit: z.number().default(0),
  marketValueEquity: z.number().default(0),
  totalLiabilities: z.number().default(0),
  sales: z.number().default(0),
});

function evaluateAllFormulas(input: Altman_z_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workingCapital / input.totalAssets; results["X1"] = Number.isFinite(v) ? v : 0; } catch { results["X1"] = 0; }
  try { const v = input.retainedEarnings / input.totalAssets; results["X2"] = Number.isFinite(v) ? v : 0; } catch { results["X2"] = 0; }
  try { const v = input.ebit / input.totalAssets; results["X3"] = Number.isFinite(v) ? v : 0; } catch { results["X3"] = 0; }
  try { const v = input.marketValueEquity / input.totalLiabilities; results["X4"] = Number.isFinite(v) ? v : 0; } catch { results["X4"] = 0; }
  try { const v = input.sales / input.totalAssets; results["X5"] = Number.isFinite(v) ? v : 0; } catch { results["X5"] = 0; }
  try { const v = 1.2 * (results["X1"] ?? 0) + 1.4 * (results["X2"] ?? 0) + 3.3 * (results["X3"] ?? 0) + 0.6 * (results["X4"] ?? 0) + 1.0 * (results["X5"] ?? 0); results["altmanZScore"] = Number.isFinite(v) ? v : 0; } catch { results["altmanZScore"] = 0; }
  return results;
}


export function calculateAltman_z_score_calculator(input: Altman_z_score_calculatorInput): Altman_z_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["altmanZScore"] ?? 0;
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


export interface Altman_z_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
