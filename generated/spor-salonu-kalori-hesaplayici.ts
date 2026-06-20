// Auto-generated from spor-salonu-kalori-hesaplayici-schema.json
import * as z from 'zod';

export interface Spor_salonu_kalori_hesaplayiciInput {
  bodyWeight: number;
  activityLevel: number;
  dataConfidence?: number;
}

export const Spor_salonu_kalori_hesaplayiciInputSchema = z.object({
  bodyWeight: z.number().min(0).default(100),
  activityLevel: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spor_salonu_kalori_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyWeight / Math.pow(input.activityLevel/100 + 1, 1.5) * 10 + Math.sqrt(input.bodyWeight) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.bodyWeight / Math.pow(input.activityLevel/100 + 1, 1.5) * 10 + Math.sqrt(input.bodyWeight) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSpor_salonu_kalori_hesaplayici(input: Spor_salonu_kalori_hesaplayiciInput): Spor_salonu_kalori_hesaplayiciOutput {
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


export interface Spor_salonu_kalori_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Spor_salonu_kalori_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

