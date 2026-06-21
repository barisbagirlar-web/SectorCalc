// Auto-generated from karlilik-endeksi-pi-hesaplama-schema.json
import * as z from 'zod';

export interface Karlilik_endeksi_pi_hesaplamaInput {
  gelecekNakitBD: number;
  yatirim: number;
  dataConfidence?: number;
}

export const Karlilik_endeksi_pi_hesaplamaInputSchema = z.object({
  gelecekNakitBD: z.number().min(0).default(150000),
  yatirim: z.number().min(0).default(100000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Karlilik_endeksi_pi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gelecekNakitBD / Math.max(1, input.yatirim); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKarlilik_endeksi_pi_hesaplama(input: Karlilik_endeksi_pi_hesaplamaInput): Karlilik_endeksi_pi_hesaplamaOutput {
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
    unit: "ratio",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Karlilik_endeksi_pi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Karlilik_endeksi_pi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

