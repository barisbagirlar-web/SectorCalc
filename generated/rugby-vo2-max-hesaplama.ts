// Auto-generated from rugby-vo2-max-hesaplama-schema.json
import * as z from 'zod';

export interface Rugby_vo2_max_hesaplamaInput {
  heartRate: number;
  dataConfidence?: number;
}

export const Rugby_vo2_max_hesaplamaInputSchema = z.object({
  heartRate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rugby_vo2_max_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heartRate * (1 + input.heartRate/500) + Math.sqrt(input.heartRate) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.heartRate * (1 + input.heartRate/500) + Math.sqrt(input.heartRate) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateRugby_vo2_max_hesaplama(input: Rugby_vo2_max_hesaplamaInput): Rugby_vo2_max_hesaplamaOutput {
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
    unit: "bpm",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Rugby_vo2_max_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rugby_vo2_max_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "bpm",
  breakdownKeys: ["result"],
} as const;

