// Auto-generated from toprak-bearing-capacity-hesaplama-schema.json
import * as z from 'zod';

export interface Toprak_bearing_capacity_hesaplamaInput {
  materialStrength: number;
  dataConfidence?: number;
}

export const Toprak_bearing_capacity_hesaplamaInputSchema = z.object({
  materialStrength: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Toprak_bearing_capacity_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialStrength * (1 + input.materialStrength/500) + Math.sqrt(input.materialStrength) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.materialStrength * (1 + input.materialStrength/500) + Math.sqrt(input.materialStrength) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateToprak_bearing_capacity_hesaplama(input: Toprak_bearing_capacity_hesaplamaInput): Toprak_bearing_capacity_hesaplamaOutput {
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
    unit: "MPa",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Toprak_bearing_capacity_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Toprak_bearing_capacity_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "MPa",
  breakdownKeys: ["result"],
} as const;

