// Auto-generated from yakit-maliyeti-hesaplama-schema.json
import * as z from 'zod';

export interface Yakit_maliyeti_hesaplamaInput {
  mesafe: number;
  tuketim: number;
  litreFiyati: number;
  dataConfidence?: number;
}

export const Yakit_maliyeti_hesaplamaInputSchema = z.object({
  mesafe: z.number().min(0).default(500),
  tuketim: z.number().min(0).default(10),
  litreFiyati: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yakit_maliyeti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mesafe / 100) * input.tuketim * input.litreFiyati; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYakit_maliyeti_hesaplama(input: Yakit_maliyeti_hesaplamaInput): Yakit_maliyeti_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inventory turnover metrics monthly.","Factor in seasonality for safety stock."];
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


export interface Yakit_maliyeti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yakit_maliyeti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

