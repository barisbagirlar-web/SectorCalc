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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Altman_z_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workingCapital / input.totalAssets; results["X1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["X1"] = 0; }
  try { const v = input.retainedEarnings / input.totalAssets; results["X2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["X2"] = 0; }
  try { const v = input.ebit / input.totalAssets; results["X3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["X3"] = 0; }
  try { const v = input.marketValueEquity / input.totalLiabilities; results["X4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["X4"] = 0; }
  try { const v = input.sales / input.totalAssets; results["X5"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["X5"] = 0; }
  try { const v = 1.2 * (asFormulaNumber(results["X1"])) + 1.4 * (asFormulaNumber(results["X2"])) + 3.3 * (asFormulaNumber(results["X3"])) + 0.6 * (asFormulaNumber(results["X4"])) + 1.0 * (asFormulaNumber(results["X5"])); results["altmanZScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["altmanZScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAltman_z_score_calculator(input: Altman_z_score_calculatorInput): Altman_z_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["altmanZScore"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
