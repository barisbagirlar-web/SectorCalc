// Auto-generated from child-dose-hesaplama-schema.json
import * as z from 'zod';

export interface Child_dose_hesaplamaInput {
  clinicalScore: number;
  param2: number;
  dataConfidence?: number;
}

export const Child_dose_hesaplamaInputSchema = z.object({
  clinicalScore: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Child_dose_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.clinicalScore - input.param2) / Math.sqrt((input.clinicalScore + input.param2) / 2 + 1) * 10 + 50; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = (input.clinicalScore - input.param2) / Math.sqrt((input.clinicalScore + input.param2) / 2 + 1) * 10 + 50; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateChild_dose_hesaplama(input: Child_dose_hesaplamaInput): Child_dose_hesaplamaOutput {
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
    unit: "points",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Child_dose_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Child_dose_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "points",
  breakdownKeys: ["result"],
} as const;

