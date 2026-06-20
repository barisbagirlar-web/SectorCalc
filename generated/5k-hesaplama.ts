// Auto-generated from 5k-hesaplama-schema.json
import * as z from 'zod';

export interface _5k_hesaplamaInput {
  distanceKm: number;
  dataConfidence?: number;
}

export const _5k_hesaplamaInputSchema = z.object({
  distanceKm: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _5k_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distanceKm * (1 + input.distanceKm/500) + Math.sqrt(input.distanceKm) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.distanceKm * (1 + input.distanceKm/500) + Math.sqrt(input.distanceKm) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculate_5k_hesaplama(input: _5k_hesaplamaInput): _5k_hesaplamaOutput {
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


export interface _5k_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const _5k_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "km",
  breakdownKeys: ["result"],
} as const;

