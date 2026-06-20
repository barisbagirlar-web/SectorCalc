// Auto-generated from yogurt-calculator-schema.json
import * as z from 'zod';

export interface Yogurt_calculatorInput {
  milkCostPerLiter: number;
  milkYieldPerLiter: number;
  starterCultureCostPerBatch: number;
  batchSizeLiters: number;
  packagingCostPerKg: number;
  overheadCostPerBatch: number;
  dataConfidence?: number;
}

export const Yogurt_calculatorInputSchema = z.object({
  milkCostPerLiter: z.number().default(5),
  milkYieldPerLiter: z.number().default(0.95),
  starterCultureCostPerBatch: z.number().default(10),
  batchSizeLiters: z.number().default(100),
  packagingCostPerKg: z.number().default(2),
  overheadCostPerBatch: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yogurt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.milkYieldPerLiter * input.batchSizeLiters; results["totalYogurt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalYogurt"] = Number.NaN; }
  try { const v = input.milkCostPerLiter * input.batchSizeLiters; results["milkCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["milkCostTotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["milkCostTotal"])) + input.starterCultureCostPerBatch + (input.packagingCostPerKg * (toNumericFormulaValue(results["totalYogurt"]))) + input.overheadCostPerBatch; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / (toNumericFormulaValue(results["totalYogurt"])); results["costPerKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerKg"] = Number.NaN; }
  return results;
}


export function calculateYogurt_calculator(input: Yogurt_calculatorInput): Yogurt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerKg"]);
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


export interface Yogurt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
