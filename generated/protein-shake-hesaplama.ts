// Auto-generated from protein-shake-hesaplama-schema.json
import * as z from 'zod';

export interface Protein_shake_hesaplamaInput {
  dailyCalories: number;
  bodyMass: number;
  dataConfidence?: number;
}

export const Protein_shake_hesaplamaInputSchema = z.object({
  dailyCalories: z.number().min(0).default(100),
  bodyMass: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Protein_shake_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyCalories / Math.pow(input.bodyMass/100 + 1, 1.5) * 10 + Math.sqrt(input.dailyCalories) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.dailyCalories / Math.pow(input.bodyMass/100 + 1, 1.5) * 10 + Math.sqrt(input.dailyCalories) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateProtein_shake_hesaplama(input: Protein_shake_hesaplamaInput): Protein_shake_hesaplamaOutput {
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


export interface Protein_shake_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Protein_shake_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kcal",
  breakdownKeys: ["result"],
} as const;

