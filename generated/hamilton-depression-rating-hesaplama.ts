// Auto-generated from hamilton-depression-rating-hesaplama-schema.json
import * as z from 'zod';

export interface Hamilton_depression_rating_hesaplamaInput {
  weight: number;
  height: number;
  dataConfidence?: number;
}

export const Hamilton_depression_rating_hesaplamaInputSchema = z.object({
  weight: z.number().min(0).default(70),
  height: z.number().min(0).default(170),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hamilton_depression_rating_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight / Math.pow(input.height/100, 2); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.weight / Math.pow(input.height/100, 2); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateHamilton_depression_rating_hesaplama(input: Hamilton_depression_rating_hesaplamaInput): Hamilton_depression_rating_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Hamilton_depression_rating_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hamilton_depression_rating_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

