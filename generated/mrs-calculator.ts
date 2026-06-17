// @ts-nocheck
// Auto-generated from mrs-calculator-schema.json
import * as z from 'zod';

export interface Mrs_calculatorInput {
  orderQuantity: number;
  unitWeight: number;
  scrapRate: number;
  machineEfficiency: number;
  materialCostPerKg: number;
}

export const Mrs_calculatorInputSchema = z.object({
  orderQuantity: z.number().default(1000),
  unitWeight: z.number().default(2.5),
  scrapRate: z.number().default(5),
  machineEfficiency: z.number().default(95),
  materialCostPerKg: z.number().default(12.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mrs_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.orderQuantity * input.unitWeight * (1 + input.scrapRate / 100); results["totalMaterialWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMaterialWeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalMaterialWeight"])) / (input.machineEfficiency / 100); results["effectiveMaterialWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveMaterialWeight"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveMaterialWeight"])) * input.materialCostPerKg; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMrs_calculator(input: Mrs_calculatorInput): Mrs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Mrs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
