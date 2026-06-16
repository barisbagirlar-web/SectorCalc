// Auto-generated from robinson-formula-calculator-schema.json
import * as z from 'zod';

export interface Robinson_formula_calculatorInput {
  totalMaterial: number;
  goodParts: number;
  unitWeight: number;
  scrap: number;
  rework: number;
}

export const Robinson_formula_calculatorInputSchema = z.object({
  totalMaterial: z.number().default(1000),
  goodParts: z.number().default(800),
  unitWeight: z.number().default(1),
  scrap: z.number().default(150),
  rework: z.number().default(50),
});

function evaluateAllFormulas(input: Robinson_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.goodParts * input.unitWeight / input.totalMaterial; results["yieldRate"] = Number.isFinite(v) ? v : 0; } catch { results["yieldRate"] = 0; }
  try { const v = input.scrap / input.totalMaterial; results["scrapRate"] = Number.isFinite(v) ? v : 0; } catch { results["scrapRate"] = 0; }
  try { const v = input.rework * input.unitWeight / input.totalMaterial; results["reworkRate"] = Number.isFinite(v) ? v : 0; } catch { results["reworkRate"] = 0; }
  return results;
}


export function calculateRobinson_formula_calculator(input: Robinson_formula_calculatorInput): Robinson_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["yieldRate"] ?? 0;
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


export interface Robinson_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
