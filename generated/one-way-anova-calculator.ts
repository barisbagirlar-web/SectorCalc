// Auto-generated from one-way-anova-calculator-schema.json
import * as z from 'zod';

export interface One_way_anova_calculatorInput {
  ssb: number;
  ssw: number;
  dfb: number;
  dfw: number;
  alpha: number;
  dataConfidence?: number;
}

export const One_way_anova_calculatorInputSchema = z.object({
  ssb: z.number().default(0),
  ssw: z.number().default(0),
  dfb: z.number().default(1),
  dfw: z.number().default(10),
  alpha: z.number().default(0.05),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: One_way_anova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ssb / input.dfb; results["msb"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["msb"] = 0; }
  try { const v = input.ssw / input.dfw; results["msw"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["msw"] = 0; }
  try { const v = (asFormulaNumber(results["msb"])) / (asFormulaNumber(results["msw"])); results["fStat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fStat"] = 0; }
  try { const v = input.ssb / (input.ssb + input.ssw); results["etaSq"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["etaSq"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOne_way_anova_calculator(input: One_way_anova_calculatorInput): One_way_anova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fStat"]);
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


export interface One_way_anova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
