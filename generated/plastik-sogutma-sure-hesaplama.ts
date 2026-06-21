// Auto-generated from plastik-sogutma-sure-hesaplama-schema.json
import * as z from 'zod';

export interface Plastik_sogutma_sure_hesaplamaInput {
  etKalinlik: number;
  termalDifuzyon: number;
  erimeSicaklik: number;
  kalipSicaklik: number;
  dataConfidence?: number;
}

export const Plastik_sogutma_sure_hesaplamaInputSchema = z.object({
  etKalinlik: z.number().min(0).default(3),
  termalDifuzyon: z.number().min(0).default(0.1),
  erimeSicaklik: z.number().min(0).default(230),
  kalipSicaklik: z.number().min(0).default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Plastik_sogutma_sure_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.pow(input.etKalinlik, 2) / (Math.pow(Math.PI, 2) * Math.max(0.0001, input.termalDifuzyon))) * Math.log(Math.max(0.0001, (4 / Math.PI) * (input.erimeSicaklik - 40) / Math.max(0.0001, (50 - 40)))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePlastik_sogutma_sure_hesaplama(input: Plastik_sogutma_sure_hesaplamaInput): Plastik_sogutma_sure_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Plastik_sogutma_sure_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Plastik_sogutma_sure_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: ["sonuc"],
} as const;

