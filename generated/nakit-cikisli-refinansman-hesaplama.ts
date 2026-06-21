// Auto-generated from nakit-cikisli-refinansman-hesaplama-schema.json
import * as z from 'zod';

export interface Nakit_cikisli_refinansman_hesaplamaInput {
  mulkDegeri: number;
  kalanBorc: number;
  yeniKredi: number;
  masraf: number;
  dataConfidence?: number;
}

export const Nakit_cikisli_refinansman_hesaplamaInputSchema = z.object({
  mulkDegeri: z.number().min(0).default(1500000),
  kalanBorc: z.number().min(0).default(500000),
  yeniKredi: z.number().min(0).default(1000000),
  masraf: z.number().min(0).default(30000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nakit_cikisli_refinansman_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yeniKredi - input.kalanBorc - input.masraf; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateNakit_cikisli_refinansman_hesaplama(input: Nakit_cikisli_refinansman_hesaplamaInput): Nakit_cikisli_refinansman_hesaplamaOutput {
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Nakit_cikisli_refinansman_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Nakit_cikisli_refinansman_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

