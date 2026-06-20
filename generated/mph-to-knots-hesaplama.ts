// Auto-generated from mph-to-knots-hesaplama-schema.json
import * as z from 'zod';

export interface Mph_to_knots_hesaplamaInput {
  speedValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Mph_to_knots_hesaplamaInputSchema = z.object({
  speedValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mph_to_knots_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speedValue * Math.exp(-input.param2 / 100) + input.speedValue * input.param2 / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.speedValue * Math.exp(-input.param2 / 100) + input.speedValue * input.param2 / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMph_to_knots_hesaplama(input: Mph_to_knots_hesaplamaInput): Mph_to_knots_hesaplamaOutput {
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
    unit: "km/h",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Mph_to_knots_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mph_to_knots_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "km/h",
  breakdownKeys: ["result"],
} as const;

