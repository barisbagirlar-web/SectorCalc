// Auto-generated from maksimum-dusus-mdd-hesaplama-schema.json
import * as z from 'zod';

export interface Maksimum_dusus_mdd_hesaplamaInput {
  zirveDeger: number;
  dipDeger: number;
  dataConfidence?: number;
}

export const Maksimum_dusus_mdd_hesaplamaInputSchema = z.object({
  zirveDeger: z.number().min(0).default(100000),
  dipDeger: z.number().min(0).default(70000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Maksimum_dusus_mdd_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.zirveDeger - input.dipDeger) / Math.max(1, input.zirveDeger)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMaksimum_dusus_mdd_hesaplama(input: Maksimum_dusus_mdd_hesaplamaInput): Maksimum_dusus_mdd_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Maksimum_dusus_mdd_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Maksimum_dusus_mdd_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

