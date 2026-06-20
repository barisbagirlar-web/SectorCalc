// Auto-generated from cha2ds2-vasc-hesaplama-schema.json
import * as z from 'zod';

export interface Cha2ds2_vasc_hesaplamaInput {
  clinicalScore: number;
  dataConfidence?: number;
}

export const Cha2ds2_vasc_hesaplamaInputSchema = z.object({
  clinicalScore: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cha2ds2_vasc_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.clinicalScore * (1 + input.clinicalScore/500) + Math.sqrt(input.clinicalScore) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.clinicalScore * (1 + input.clinicalScore/500) + Math.sqrt(input.clinicalScore) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCha2ds2_vasc_hesaplama(input: Cha2ds2_vasc_hesaplamaInput): Cha2ds2_vasc_hesaplamaOutput {
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
    unit: "points",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Cha2ds2_vasc_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cha2ds2_vasc_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "points",
  breakdownKeys: ["result"],
} as const;

