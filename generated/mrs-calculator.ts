// Auto-generated from mrs-calculator-schema.json
import * as z from 'zod';

export interface Mrs_calculatorInput {
  orderQuantity: number;
  unitWeight: number;
  scrapRate: number;
  machineEfficiency: number;
  materialCostPerKg: number;
  dataConfidence?: number;
}

export const Mrs_calculatorInputSchema = z.object({
  orderQuantity: z.number().default(1000),
  unitWeight: z.number().default(2.5),
  scrapRate: z.number().default(5),
  machineEfficiency: z.number().default(95),
  materialCostPerKg: z.number().default(12.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mrs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.orderQuantity * input.unitWeight * (1 + input.scrapRate / 100); results["totalMaterialWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMaterialWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMaterialWeight"])) / (input.machineEfficiency / 100); results["effectiveMaterialWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveMaterialWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveMaterialWeight"])) * input.materialCostPerKg; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateMrs_calculator(input: Mrs_calculatorInput): Mrs_calculatorOutput {
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


export interface Mrs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
