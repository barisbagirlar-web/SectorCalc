// Auto-generated from keto-hesaplama-schema.json
import * as z from 'zod';

export interface Keto_hesaplamaInput {
  dailyCalories: number;
  bodyMass: number;
  dataConfidence?: number;
}

export const Keto_hesaplamaInputSchema = z.object({
  dailyCalories: z.number().min(0).default(100),
  bodyMass: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Keto_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyCalories * input.bodyMass / (input.dailyCalories + input.bodyMass + 1) * 100 + Math.sqrt(Math.abs(input.dailyCalories - input.bodyMass)); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.dailyCalories * input.bodyMass / (input.dailyCalories + input.bodyMass + 1) * 100 + Math.sqrt(Math.abs(input.dailyCalories - input.bodyMass)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateKeto_hesaplama(input: Keto_hesaplamaInput): Keto_hesaplamaOutput {
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
    unit: "kcal",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Keto_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Keto_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kcal",
  breakdownKeys: ["result"],
} as const;

