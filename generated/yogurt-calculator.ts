// @ts-nocheck
// Auto-generated from yogurt-calculator-schema.json
import * as z from 'zod';

export interface Yogurt_calculatorInput {
  milkCostPerLiter: number;
  milkYieldPerLiter: number;
  starterCultureCostPerBatch: number;
  batchSizeLiters: number;
  packagingCostPerKg: number;
  overheadCostPerBatch: number;
}

export const Yogurt_calculatorInputSchema = z.object({
  milkCostPerLiter: z.number().default(5),
  milkYieldPerLiter: z.number().default(0.95),
  starterCultureCostPerBatch: z.number().default(10),
  batchSizeLiters: z.number().default(100),
  packagingCostPerKg: z.number().default(2),
  overheadCostPerBatch: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Yogurt_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.milkYieldPerLiter * input.batchSizeLiters; results["totalYogurt"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalYogurt"] = 0; }
  try { const v = input.milkCostPerLiter * input.batchSizeLiters; results["milkCostTotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["milkCostTotal"] = 0; }
  try { const v = (asFormulaNumber(results["milkCostTotal"])) + input.starterCultureCostPerBatch + (input.packagingCostPerKg * (asFormulaNumber(results["totalYogurt"]))) + input.overheadCostPerBatch; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / (asFormulaNumber(results["totalYogurt"])); results["costPerKg"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerKg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateYogurt_calculator(input: Yogurt_calculatorInput): Yogurt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerKg"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
