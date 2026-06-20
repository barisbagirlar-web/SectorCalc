// Auto-generated from bazal-metabolizma-hizi-hesaplayici-endustri-muhendisligi-standardi-schema.json
import * as z from 'zod';

export interface Bazal_metabolizma_hizi_hesaplayici_endustri_muhendisligi_standardiInput {
  bodyWeight: number;
  dataConfidence?: number;
}

export const Bazal_metabolizma_hizi_hesaplayici_endustri_muhendisligi_standardiInputSchema = z.object({
  bodyWeight: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bazal_metabolizma_hizi_hesaplayici_endustri_muhendisligi_standardiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyWeight * (1 + input.bodyWeight/500) + Math.sqrt(input.bodyWeight) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.bodyWeight * (1 + input.bodyWeight/500) + Math.sqrt(input.bodyWeight) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBazal_metabolizma_hizi_hesaplayici_endustri_muhendisligi_standardi(input: Bazal_metabolizma_hizi_hesaplayici_endustri_muhendisligi_standardiInput): Bazal_metabolizma_hizi_hesaplayici_endustri_muhendisligi_standardiOutput {
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


export interface Bazal_metabolizma_hizi_hesaplayici_endustri_muhendisligi_standardiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bazal_metabolizma_hizi_hesaplayici_endustri_muhendisligi_standardiOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

