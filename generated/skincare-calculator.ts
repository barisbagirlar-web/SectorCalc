// @ts-nocheck
// Auto-generated from skincare-calculator-schema.json
import * as z from 'zod';

export interface Skincare_calculatorInput {
  ingredientCostPerKg: number;
  ingredientUsageGramsPerUnit: number;
  packagingCostPerUnit: number;
  batchSize: number;
  laborCostPerBatch: number;
  overheadCostPerBatch: number;
  profitMarginPercent: number;
}

export const Skincare_calculatorInputSchema = z.object({
  ingredientCostPerKg: z.number().default(10),
  ingredientUsageGramsPerUnit: z.number().default(50),
  packagingCostPerUnit: z.number().default(2),
  batchSize: z.number().default(1000),
  laborCostPerBatch: z.number().default(500),
  overheadCostPerBatch: z.number().default(300),
  profitMarginPercent: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Skincare_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.ingredientCostPerKg * input.ingredientUsageGramsPerUnit / 1000) + input.packagingCostPerUnit + ((input.laborCostPerBatch + input.overheadCostPerBatch) / input.batchSize)); results["costPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerUnit"] = 0; }
  try { const v = ((input.ingredientCostPerKg * input.ingredientUsageGramsPerUnit / 1000) + input.packagingCostPerUnit + ((input.laborCostPerBatch + input.overheadCostPerBatch) / input.batchSize)) / (1 - input.profitMarginPercent / 100); results["sellingPricePerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sellingPricePerUnit"] = 0; }
  try { const v = (((input.ingredientCostPerKg * input.ingredientUsageGramsPerUnit / 1000) + input.packagingCostPerUnit + ((input.laborCostPerBatch + input.overheadCostPerBatch) / input.batchSize)) / (1 - input.profitMarginPercent / 100)) - ((input.ingredientCostPerKg * input.ingredientUsageGramsPerUnit / 1000) + input.packagingCostPerUnit + ((input.laborCostPerBatch + input.overheadCostPerBatch) / input.batchSize)); results["profitPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profitPerUnit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSkincare_calculator(input: Skincare_calculatorInput): Skincare_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPricePerUnit"]);
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


export interface Skincare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
