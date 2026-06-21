// Auto-generated from brrrr-yatirim-stratejisi-hesaplama-schema.json
import * as z from 'zod';

export interface Brrrr_yatirim_stratejisi_hesaplamaInput {
  alim: number;
  rehab: number;
  deger: number;
  kredi: number;
  kira: number;
  dataConfidence?: number;
}

export const Brrrr_yatirim_stratejisi_hesaplamaInputSchema = z.object({
  alim: z.number().min(0).default(500000),
  rehab: z.number().min(0).default(150000),
  deger: z.number().min(0).default(800000),
  kredi: z.number().min(0).default(600000),
  kira: z.number().min(0).default(8000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Brrrr_yatirim_stratejisi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.alim + input.rehab - input.kredi; results["zorunluSermaye"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zorunluSermaye"] = Number.NaN; }
  try { const v = ((input.kira * 12) / Math.max(1, (input.alim + input.rehab - input.kredi))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBrrrr_yatirim_stratejisi_hesaplama(input: Brrrr_yatirim_stratejisi_hesaplamaInput): Brrrr_yatirim_stratejisi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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


export interface Brrrr_yatirim_stratejisi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Brrrr_yatirim_stratejisi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

