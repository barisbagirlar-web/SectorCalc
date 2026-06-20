// Auto-generated from smoking-cost-calculator-schema.json
import * as z from 'zod';

export interface Smoking_cost_calculatorInput {
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  pricePerPack: number;
  yearsSmoking: number;
  dataConfidence?: number;
}

export const Smoking_cost_calculatorInputSchema = z.object({
  cigarettesPerDay: z.number().default(20),
  cigarettesPerPack: z.number().default(20),
  pricePerPack: z.number().default(10),
  yearsSmoking: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Smoking_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cigarettesPerDay / input.cigarettesPerPack) * input.pricePerPack; results["dailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyCost"])) * 365; results["yearlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yearlyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["yearlyCost"])) / 52; results["weeklyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weeklyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["yearlyCost"])) / 12; results["monthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyCost"])) * 365 * input.yearsSmoking; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateSmoking_cost_calculator(input: Smoking_cost_calculatorInput): Smoking_cost_calculatorOutput {
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


export interface Smoking_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
