// Auto-generated from safe-yatirim-anlasmasi-hesaplama-schema.json
import * as z from 'zod';

export interface Safe_yatirim_anlasmasi_hesaplamaInput {
  yatirim: number;
  tavanDeger: number;
  toplamHisse: number;
  dataConfidence?: number;
}

export const Safe_yatirim_anlasmasi_hesaplamaInputSchema = z.object({
  yatirim: z.number().min(0).default(500000),
  tavanDeger: z.number().min(0).default(5000000),
  toplamHisse: z.number().min(0).default(1000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Safe_yatirim_anlasmasi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tavanDeger / Math.max(1, input.toplamHisse); results["donusumFiyati"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["donusumFiyati"] = Number.NaN; }
  try { const v = input.yatirim / Math.max(0.0001, (input.tavanDeger / Math.max(1, input.toplamHisse))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSafe_yatirim_anlasmasi_hesaplama(input: Safe_yatirim_anlasmasi_hesaplamaInput): Safe_yatirim_anlasmasi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "shares",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Safe_yatirim_anlasmasi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Safe_yatirim_anlasmasi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "shares",
  breakdownKeys: ["sonuc"],
} as const;

