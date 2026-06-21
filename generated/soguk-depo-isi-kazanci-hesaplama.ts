// Auto-generated from soguk-depo-isi-kazanci-hesaplama-schema.json
import * as z from 'zod';

export interface Soguk_depo_isi_kazanci_hesaplamaInput {
  alan: number;
  U_Katsayi: number;
  disSicaklik: number;
  icSicaklik: number;
  dataConfidence?: number;
}

export const Soguk_depo_isi_kazanci_hesaplamaInputSchema = z.object({
  alan: z.number().min(0).default(200),
  U_Katsayi: z.number().min(0).default(0.3),
  disSicaklik: z.number().min(0).default(35),
  icSicaklik: z.number().min(0).default(-20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Soguk_depo_isi_kazanci_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.alan * input.U_Katsayi * (input.disSicaklik - input.icSicaklik); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSoguk_depo_isi_kazanci_hesaplama(input: Soguk_depo_isi_kazanci_hesaplamaInput): Soguk_depo_isi_kazanci_hesaplamaOutput {
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
    unit: "W",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Soguk_depo_isi_kazanci_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Soguk_depo_isi_kazanci_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "W",
  breakdownKeys: ["sonuc"],
} as const;

