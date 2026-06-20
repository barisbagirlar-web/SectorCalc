// Auto-generated from us-mpg-to-uk-mpg-hesaplama-schema.json
import * as z from 'zod';

export interface Us_mpg_to_uk_mpg_hesaplamaInput {
  distanceTraveled: number;
  dataConfidence?: number;
}

export const Us_mpg_to_uk_mpg_hesaplamaInputSchema = z.object({
  distanceTraveled: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Us_mpg_to_uk_mpg_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distanceTraveled * 1.0 + Math.log(input.distanceTraveled + 1) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.distanceTraveled * 1.0 + Math.log(input.distanceTraveled + 1) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateUs_mpg_to_uk_mpg_hesaplama(input: Us_mpg_to_uk_mpg_hesaplamaInput): Us_mpg_to_uk_mpg_hesaplamaOutput {
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
    unit: "km",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Us_mpg_to_uk_mpg_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Us_mpg_to_uk_mpg_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "km",
  breakdownKeys: ["result"],
} as const;

