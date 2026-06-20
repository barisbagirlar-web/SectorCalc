// Auto-generated from metabolic-equivalent-hesaplama-schema.json
import * as z from 'zod';

export interface Metabolic_equivalent_hesaplamaInput {
  bodyWeight: number;
  activityLevel: number;
  dataConfidence?: number;
}

export const Metabolic_equivalent_hesaplamaInputSchema = z.object({
  bodyWeight: z.number().min(0).default(100),
  activityLevel: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Metabolic_equivalent_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyWeight / input.activityLevel * 100 + Math.sqrt(input.bodyWeight * input.activityLevel) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.bodyWeight / input.activityLevel * 100 + Math.sqrt(input.bodyWeight * input.activityLevel) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMetabolic_equivalent_hesaplama(input: Metabolic_equivalent_hesaplamaInput): Metabolic_equivalent_hesaplamaOutput {
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Metabolic_equivalent_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Metabolic_equivalent_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

