// Auto-generated from npk-calculator-schema.json
import * as z from 'zod';

export interface Npk_calculatorInput {
  nPercent: number;
  pPercent: number;
  kPercent: number;
  totalWeight: number;
  dataConfidence?: number;
}

export const Npk_calculatorInputSchema = z.object({
  nPercent: z.number().default(10),
  pPercent: z.number().default(10),
  kPercent: z.number().default(10),
  totalWeight: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Npk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.nPercent/100)*input.totalWeight + (input.pPercent/100)*input.totalWeight + (input.kPercent/100)*input.totalWeight; results["totalNutrientWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalNutrientWeight"] = 0; }
  try { const v = (input.nPercent/100)*input.totalWeight; results["nWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nWeight"] = 0; }
  try { const v = (input.pPercent/100)*input.totalWeight; results["pWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pWeight"] = 0; }
  try { const v = (input.kPercent/100)*input.totalWeight; results["kWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["kWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNpk_calculator(input: Npk_calculatorInput): Npk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalNutrientWeight"]);
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


export interface Npk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
