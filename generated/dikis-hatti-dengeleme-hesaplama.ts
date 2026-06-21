// Auto-generated from dikis-hatti-dengeleme-hesaplama-schema.json
import * as z from 'zod';

export interface Dikis_hatti_dengeleme_hesaplamaInput {
  smvToplam: number;
  taktTime: number;
  operator: number;
  dataConfidence?: number;
}

export const Dikis_hatti_dengeleme_hesaplamaInputSchema = z.object({
  smvToplam: z.number().min(0).default(120),
  taktTime: z.number().min(0).default(10),
  operator: z.number().min(1).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dikis_hatti_dengeleme_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.smvToplam / Math.max(0.0001, (input.operator * input.taktTime))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDikis_hatti_dengeleme_hesaplama(input: Dikis_hatti_dengeleme_hesaplamaInput): Dikis_hatti_dengeleme_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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


export interface Dikis_hatti_dengeleme_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dikis_hatti_dengeleme_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

