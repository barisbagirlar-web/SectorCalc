// Auto-generated from kutle-enerji-equivalence-hesaplama-schema.json
import * as z from 'zod';

export interface Kutle_enerji_equivalence_hesaplamaInput {
  usage: number;
  rate: number;
  dataConfidence?: number;
}

export const Kutle_enerji_equivalence_hesaplamaInputSchema = z.object({
  usage: z.number().min(0).default(100),
  rate: z.number().min(0).default(0.12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kutle_enerji_equivalence_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.usage * input.rate; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.usage * input.rate; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateKutle_enerji_equivalence_hesaplama(input: Kutle_enerji_equivalence_hesaplamaInput): Kutle_enerji_equivalence_hesaplamaOutput {
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
    unit: "kWh",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Kutle_enerji_equivalence_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kutle_enerji_equivalence_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kWh",
  breakdownKeys: ["result"],
} as const;

