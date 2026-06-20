// Auto-generated from two-way-anova-calculator-schema.json
import * as z from 'zod';

export interface Two_way_anova_calculatorInput {
  SSA: number;
  SSB: number;
  SSAB: number;
  SSE: number;
  dfA: number;
  dfB: number;
  dfAB: number;
  dfE: number;
  dataConfidence?: number;
}

export const Two_way_anova_calculatorInputSchema = z.object({
  SSA: z.number().default(0),
  SSB: z.number().default(0),
  SSAB: z.number().default(0),
  SSE: z.number().default(0),
  dfA: z.number().default(1),
  dfB: z.number().default(1),
  dfAB: z.number().default(1),
  dfE: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Two_way_anova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.SSA / input.dfA; results["MSA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MSA"] = Number.NaN; }
  try { const v = input.SSB / input.dfB; results["MSB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MSB"] = Number.NaN; }
  try { const v = input.SSAB / input.dfAB; results["MSAB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MSAB"] = Number.NaN; }
  try { const v = input.SSE / input.dfE; results["MSE"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MSE"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["MSA"])) / (toNumericFormulaValue(results["MSE"])); results["FA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FA"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["MSB"])) / (toNumericFormulaValue(results["MSE"])); results["FB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FB"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["MSAB"])) / (toNumericFormulaValue(results["MSE"])); results["FAB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FAB"] = Number.NaN; }
  return results;
}


export function calculateTwo_way_anova_calculator(input: Two_way_anova_calculatorInput): Two_way_anova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["FAB"]);
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


export interface Two_way_anova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
