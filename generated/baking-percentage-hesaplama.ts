// Auto-generated from baking-percentage-hesaplama-schema.json
import * as z from 'zod';

export interface Baking_percentage_hesaplamaInput {
  servingSize: number;
  ingredientAmount: number;
  dataConfidence?: number;
}

export const Baking_percentage_hesaplamaInputSchema = z.object({
  servingSize: z.number().min(0).default(100),
  ingredientAmount: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baking_percentage_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.servingSize / input.ingredientAmount * 100 + Math.sqrt(input.servingSize * input.ingredientAmount) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.servingSize / input.ingredientAmount * 100 + Math.sqrt(input.servingSize * input.ingredientAmount) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBaking_percentage_hesaplama(input: Baking_percentage_hesaplamaInput): Baking_percentage_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    unit: "g",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Baking_percentage_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Baking_percentage_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "g",
  breakdownKeys: ["result"],
} as const;

