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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Skincare_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.ingredientCostPerKg * input.ingredientUsageGramsPerUnit / 1000) + input.packagingCostPerUnit + ((input.laborCostPerBatch + input.overheadCostPerBatch) / input.batchSize)); results["costPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerUnit"] = Number.NaN; }
  try { const v = ((input.ingredientCostPerKg * input.ingredientUsageGramsPerUnit / 1000) + input.packagingCostPerUnit + ((input.laborCostPerBatch + input.overheadCostPerBatch) / input.batchSize)) / (1 - input.profitMarginPercent / 100); results["sellingPricePerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellingPricePerUnit"] = Number.NaN; }
  try { const v = (((input.ingredientCostPerKg * input.ingredientUsageGramsPerUnit / 1000) + input.packagingCostPerUnit + ((input.laborCostPerBatch + input.overheadCostPerBatch) / input.batchSize)) / (1 - input.profitMarginPercent / 100)) - ((input.ingredientCostPerKg * input.ingredientUsageGramsPerUnit / 1000) + input.packagingCostPerUnit + ((input.laborCostPerBatch + input.overheadCostPerBatch) / input.batchSize)); results["profitPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitPerUnit"] = Number.NaN; }
  return results;
}


export function calculateSkincare_calculator(input: Skincare_calculatorInput): Skincare_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPricePerUnit"]);
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


export interface Skincare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
