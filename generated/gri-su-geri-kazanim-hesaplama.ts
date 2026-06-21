// Auto-generated from gri-su-geri-kazanim-hesaplama-schema.json
import * as z from 'zod';

export interface Gri_su_geri_kazanim_hesaplamaInput {
  griSuHacmi: number;
  aritmaMaliyet: number;
  sebekeFiyat: number;
  dataConfidence?: number;
}

export const Gri_su_geri_kazanim_hesaplamaInputSchema = z.object({
  griSuHacmi: z.number().min(0).default(5),
  aritmaMaliyet: z.number().min(0).default(3),
  sebekeFiyat: z.number().min(0).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gri_su_geri_kazanim_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.griSuHacmi * (input.sebekeFiyat - input.aritmaMaliyet) * 365; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateGri_su_geri_kazanim_hesaplama(input: Gri_su_geri_kazanim_hesaplamaInput): Gri_su_geri_kazanim_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High environmental score may reduce operational costs.","Low ESG score may increase capital costs."];
  const suggestedActions: string[] = ["Set improvement targets for each ESG pillar.","Consider carbon offset programs for residual emissions."];
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
    unit: "TL/year",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Gri_su_geri_kazanim_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gri_su_geri_kazanim_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TL/year",
  breakdownKeys: ["sonuc"],
} as const;

