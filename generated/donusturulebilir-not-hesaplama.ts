// Auto-generated from donusturulebilir-not-hesaplama-schema.json
import * as z from 'zod';

export interface Donusturulebilir_not_hesaplamaInput {
  yatirim: number;
  degerleme: number;
  iskonto: number;
  faiz: number;
  dataConfidence?: number;
}

export const Donusturulebilir_not_hesaplamaInputSchema = z.object({
  yatirim: z.number().min(0).default(500000),
  degerleme: z.number().min(0).default(5000000),
  iskonto: z.number().min(0).max(100).default(20),
  faiz: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Donusturulebilir_not_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.degerleme * (1 - input.iskonto / 100); results["donusumFiyati"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["donusumFiyati"] = Number.NaN; }
  try { const v = (input.yatirim * (1 + input.faiz / 100)) / Math.max(0.0001, (input.degerleme * (1 - input.iskonto / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDonusturulebilir_not_hesaplama(input: Donusturulebilir_not_hesaplamaInput): Donusturulebilir_not_hesaplamaOutput {
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


export interface Donusturulebilir_not_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Donusturulebilir_not_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "shares",
  breakdownKeys: ["sonuc"],
} as const;

