// Auto-generated from bazal-metabolizma-hizi-hesaplayici-schema.json
import * as z from 'zod';

export interface Bazal_metabolizma_hizi_hesaplayiciInput {
  bodyWeight: number;
  dataConfidence?: number;
}

export const Bazal_metabolizma_hizi_hesaplayiciInputSchema = z.object({
  bodyWeight: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bazal_metabolizma_hizi_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyWeight * (1 + input.bodyWeight/500) + Math.sqrt(input.bodyWeight) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.bodyWeight * (1 + input.bodyWeight/500) + Math.sqrt(input.bodyWeight) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBazal_metabolizma_hizi_hesaplayici(input: Bazal_metabolizma_hizi_hesaplayiciInput): Bazal_metabolizma_hizi_hesaplayiciOutput {
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


export interface Bazal_metabolizma_hizi_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bazal_metabolizma_hizi_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

