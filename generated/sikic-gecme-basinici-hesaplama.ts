// Auto-generated from sikic-gecme-basinici-hesaplama-schema.json
import * as z from 'zod';

export interface Sikic_gecme_basinici_hesaplamaInput {
  girisim: number;
  cap: number;
  E1: number;
  E2: number;
  dataConfidence?: number;
}

export const Sikic_gecme_basinici_hesaplamaInputSchema = z.object({
  girisim: z.number().min(0).default(0.00005),
  cap: z.number().min(0).default(0.05),
  E1: z.number().min(0).default(200000000000),
  E2: z.number().min(0).default(200000000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sikic_gecme_basinici_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.girisim / Math.max(0.0001, (input.cap * (1 / Math.max(0.0001, input.E1) + 1 / Math.max(0.0001, input.E2)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSikic_gecme_basinici_hesaplama(input: Sikic_gecme_basinici_hesaplamaInput): Sikic_gecme_basinici_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sikic_gecme_basinici_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sikic_gecme_basinici_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["sonuc"],
} as const;

