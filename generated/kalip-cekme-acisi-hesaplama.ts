// Auto-generated from kalip-cekme-acisi-hesaplama-schema.json
import * as z from 'zod';

export interface Kalip_cekme_acisi_hesaplamaInput {
  parcaDerinlik: number;
  buzulmeOrani: number;
  yanYuzeyUzunluk: number;
  dataConfidence?: number;
}

export const Kalip_cekme_acisi_hesaplamaInputSchema = z.object({
  parcaDerinlik: z.number().min(0).default(50),
  buzulmeOrani: z.number().min(0).default(1.5),
  yanYuzeyUzunluk: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kalip_cekme_acisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.atan((input.parcaDerinlik * (input.buzulmeOrani / 100)) / Math.max(0.0001, input.yanYuzeyUzunluk)) * (180 / Math.PI); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKalip_cekme_acisi_hesaplama(input: Kalip_cekme_acisi_hesaplamaInput): Kalip_cekme_acisi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "degrees",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kalip_cekme_acisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kalip_cekme_acisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "degrees",
  breakdownKeys: ["sonuc"],
} as const;

