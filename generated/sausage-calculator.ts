// Auto-generated from sausage-calculator-schema.json
import * as z from 'zod';

export interface Sausage_calculatorInput {
  totalWeight: number;
  fatPercentage: number;
  meatCost: number;
  fatCost: number;
  casingDiameter: number;
  casingCost: number;
  dataConfidence?: number;
}

export const Sausage_calculatorInputSchema = z.object({
  totalWeight: z.number().default(10),
  fatPercentage: z.number().default(20),
  meatCost: z.number().default(5),
  fatCost: z.number().default(2),
  casingDiameter: z.number().default(30),
  casingCost: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sausage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWeight * (1 - input.fatPercentage / 100); results["meatWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meatWeight"] = Number.NaN; }
  try { const v = input.totalWeight * (input.fatPercentage / 100); results["fatWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fatWeight"] = Number.NaN; }
  try { const v = input.totalWeight * 1000 / (3.14159 * (input.casingDiameter / 1000) * (input.casingDiameter / 1000) * 1000); results["casingLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["casingLength"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["meatWeight"])) * input.meatCost; results["meatCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meatCostTotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fatWeight"])) * input.fatCost; results["fatCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fatCostTotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["casingLength"])) * input.casingCost; results["casingCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["casingCostTotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["meatCostTotal"])) + (toNumericFormulaValue(results["fatCostTotal"])) + (toNumericFormulaValue(results["casingCostTotal"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateSausage_calculator(input: Sausage_calculatorInput): Sausage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Sausage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
