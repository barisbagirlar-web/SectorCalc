// Auto-generated from ahsap-siding-hesaplama-schema.json
import * as z from 'zod';

export interface Ahsap_siding_hesaplamaInput {
  alan: number;
  tahtaEn: number;
  bindirmePayi: number;
  dataConfidence?: number;
}

export const Ahsap_siding_hesaplamaInputSchema = z.object({
  alan: z.number().min(0).default(40),
  tahtaEn: z.number().min(0).default(0.15),
  bindirmePayi: z.number().min(0).default(0.025),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ahsap_siding_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.alan / Math.max(0.0001, (input.tahtaEn - input.bindirmePayi)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAhsap_siding_hesaplama(input: Ahsap_siding_hesaplamaInput): Ahsap_siding_hesaplamaOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ahsap_siding_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ahsap_siding_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

