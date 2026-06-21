// Auto-generated from hayat-sigortasi-ihtiyac-hesaplama-schema.json
import * as z from 'zod';

export interface Hayat_sigortasi_ihtiyac_hesaplamaInput {
  yillikGelir: number;
  bagimliSayisi: number;
  borclar: number;
  birikim: number;
  dataConfidence?: number;
}

export const Hayat_sigortasi_ihtiyac_hesaplamaInputSchema = z.object({
  yillikGelir: z.number().min(0).default(200000),
  bagimliSayisi: z.number().min(0).default(2),
  borclar: z.number().min(0).default(500000),
  birikim: z.number().min(0).default(100000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hayat_sigortasi_ihtiyac_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, (input.yillikGelir * 10 * input.bagimliSayisi) + input.borclar - input.birikim); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateHayat_sigortasi_ihtiyac_hesaplama(input: Hayat_sigortasi_ihtiyac_hesaplamaInput): Hayat_sigortasi_ihtiyac_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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


export interface Hayat_sigortasi_ihtiyac_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hayat_sigortasi_ihtiyac_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

