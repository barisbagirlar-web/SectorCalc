// Auto-generated from annuite-odeme-emeklilik-hesaplama-schema.json
import * as z from 'zod';

export interface Annuite_odeme_emeklilik_hesaplamaInput {
  birikim: number;
  faiz: number;
  sure: number;
  dataConfidence?: number;
}

export const Annuite_odeme_emeklilik_hesaplamaInputSchema = z.object({
  birikim: z.number().min(0).default(1000000),
  faiz: z.number().min(0).default(6),
  sure: z.number().min(1).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Annuite_odeme_emeklilik_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birikim * ((input.faiz/100) / Math.max(0.0001, (1 - Math.pow(1 + input.faiz/100, -input.sure)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAnnuite_odeme_emeklilik_hesaplama(input: Annuite_odeme_emeklilik_hesaplamaInput): Annuite_odeme_emeklilik_hesaplamaOutput {
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Annuite_odeme_emeklilik_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Annuite_odeme_emeklilik_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

