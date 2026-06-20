// Auto-generated from smoking-calculator-schema.json
import * as z from 'zod';

export interface Smoking_calculatorInput {
  cigarettesPerDay: number;
  costPerPack: number;
  yearsSmoking: number;
  packSize: number;
  dataConfidence?: number;
}

export const Smoking_calculatorInputSchema = z.object({
  cigarettesPerDay: z.number().default(20),
  costPerPack: z.number().default(30),
  yearsSmoking: z.number().default(10),
  packSize: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Smoking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cigarettesPerDay / input.packSize) * input.costPerPack; results["dailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyCost"])) * 365; results["yearlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yearlyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["yearlyCost"])) * input.yearsSmoking; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateSmoking_calculator(input: Smoking_calculatorInput): Smoking_calculatorOutput {
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


export interface Smoking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
