// Auto-generated from ahsap-boya-leke-hesaplama-schema.json
import * as z from 'zod';

export interface Ahsap_boya_leke_hesaplamaInput {
  alan: number;
  sarfiyat: number;
  dataConfidence?: number;
}

export const Ahsap_boya_leke_hesaplamaInputSchema = z.object({
  alan: z.number().min(0).default(30),
  sarfiyat: z.number().min(0).default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ahsap_boya_leke_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.alan / Math.max(0.0001, input.sarfiyat); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAhsap_boya_leke_hesaplama(input: Ahsap_boya_leke_hesaplamaInput): Ahsap_boya_leke_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "L",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ahsap_boya_leke_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ahsap_boya_leke_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "L",
  breakdownKeys: ["sonuc"],
} as const;

