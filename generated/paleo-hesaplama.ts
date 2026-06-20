// Auto-generated from paleo-hesaplama-schema.json
import * as z from 'zod';

export interface Paleo_hesaplamaInput {
  dailyCalories: number;
  bodyMass: number;
  dataConfidence?: number;
}

export const Paleo_hesaplamaInputSchema = z.object({
  dailyCalories: z.number().min(0).default(100),
  bodyMass: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Paleo_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyCalories / input.bodyMass * 100 + Math.sqrt(input.dailyCalories * input.bodyMass) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.dailyCalories / input.bodyMass * 100 + Math.sqrt(input.dailyCalories * input.bodyMass) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePaleo_hesaplama(input: Paleo_hesaplamaInput): Paleo_hesaplamaOutput {
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


export interface Paleo_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Paleo_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kcal",
  breakdownKeys: ["result"],
} as const;

