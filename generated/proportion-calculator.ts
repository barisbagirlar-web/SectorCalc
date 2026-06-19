// Auto-generated from proportion-calculator-schema.json
import * as z from 'zod';

export interface Proportion_calculatorInput {
  comp1: number;
  comp2: number;
  comp3: number;
  comp4: number;
  dataConfidence?: number;
}

export const Proportion_calculatorInputSchema = z.object({
  comp1: z.number().default(0),
  comp2: z.number().default(0),
  comp3: z.number().default(0),
  comp4: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Proportion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.comp1 + input.comp2 + input.comp3 + input.comp4; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeight"])) > 0 ? (input.comp1 / (asFormulaNumber(results["totalWeight"]))) * 100 : 0; results["prop1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["prop1"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeight"])) > 0 ? (input.comp2 / (asFormulaNumber(results["totalWeight"]))) * 100 : 0; results["prop2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["prop2"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeight"])) > 0 ? (input.comp3 / (asFormulaNumber(results["totalWeight"]))) * 100 : 0; results["prop3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["prop3"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeight"])) > 0 ? (input.comp4 / (asFormulaNumber(results["totalWeight"]))) * 100 : 0; results["prop4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["prop4"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateProportion_calculator(input: Proportion_calculatorInput): Proportion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalWeight"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Proportion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
