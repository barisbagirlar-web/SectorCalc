// Auto-generated from robinson-formula-calculator-schema.json
import * as z from 'zod';

export interface Robinson_formula_calculatorInput {
  totalMaterial: number;
  goodParts: number;
  unitWeight: number;
  scrap: number;
  rework: number;
  dataConfidence?: number;
}

export const Robinson_formula_calculatorInputSchema = z.object({
  totalMaterial: z.number().default(1000),
  goodParts: z.number().default(800),
  unitWeight: z.number().default(1),
  scrap: z.number().default(150),
  rework: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Robinson_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.goodParts * input.unitWeight / input.totalMaterial; results["yieldRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldRate"] = Number.NaN; }
  try { const v = input.scrap / input.totalMaterial; results["scrapRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scrapRate"] = Number.NaN; }
  try { const v = input.rework * input.unitWeight / input.totalMaterial; results["reworkRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reworkRate"] = Number.NaN; }
  return results;
}


export function calculateRobinson_formula_calculator(input: Robinson_formula_calculatorInput): Robinson_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yieldRate"]);
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


export interface Robinson_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
