// Auto-generated from vadeli-islem-futures-hesaplama-schema.json
import * as z from 'zod';

export interface Vadeli_islem_futures_hesaplamaInput {
  girisFiyati: number;
  cikisFiyati: number;
  carpan: number;
  lot: number;
  dataConfidence?: number;
}

export const Vadeli_islem_futures_hesaplamaInputSchema = z.object({
  girisFiyati: z.number().min(0).default(100),
  cikisFiyati: z.number().min(0).default(105),
  carpan: z.number().min(1).default(100),
  lot: z.number().min(1).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vadeli_islem_futures_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cikisFiyati - input.girisFiyati) * input.carpan * input.lot; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateVadeli_islem_futures_hesaplama(input: Vadeli_islem_futures_hesaplamaInput): Vadeli_islem_futures_hesaplamaOutput {
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


export interface Vadeli_islem_futures_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vadeli_islem_futures_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

