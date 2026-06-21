// Auto-generated from celik-kiris-egilme-hesaplama-schema.json
import * as z from 'zod';

export interface Celik_kiris_egilme_hesaplamaInput {
  moment: number;
  kesitModulu: number;
  dataConfidence?: number;
}

export const Celik_kiris_egilme_hesaplamaInputSchema = z.object({
  moment: z.number().min(0).default(50000),
  kesitModulu: z.number().min(0).default(0.00025),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Celik_kiris_egilme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.moment / Math.max(0.0001, input.kesitModulu); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCelik_kiris_egilme_hesaplama(input: Celik_kiris_egilme_hesaplamaInput): Celik_kiris_egilme_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Celik_kiris_egilme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Celik_kiris_egilme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

