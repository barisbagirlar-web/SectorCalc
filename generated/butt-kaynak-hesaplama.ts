// Auto-generated from butt-kaynak-hesaplama-schema.json
import * as z from 'zod';

export interface Butt_kaynak_hesaplamaInput {
  materialStrength: number;
  dataConfidence?: number;
}

export const Butt_kaynak_hesaplamaInputSchema = z.object({
  materialStrength: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Butt_kaynak_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialStrength * (1 + input.materialStrength/500) + Math.sqrt(input.materialStrength) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.materialStrength * (1 + input.materialStrength/500) + Math.sqrt(input.materialStrength) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateButt_kaynak_hesaplama(input: Butt_kaynak_hesaplamaInput): Butt_kaynak_hesaplamaOutput {
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


export interface Butt_kaynak_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Butt_kaynak_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "MPa",
  breakdownKeys: ["result"],
} as const;

