// Auto-generated from firin-kapasitesi-hesaplama-schema.json
import * as z from 'zod';

export interface Firin_kapasitesi_hesaplamaInput {
  tavaSayisi: number;
  tavaKapasite: number;
  pismeSure: number;
  dataConfidence?: number;
}

export const Firin_kapasitesi_hesaplamaInputSchema = z.object({
  tavaSayisi: z.number().min(0).default(10),
  tavaKapasite: z.number().min(0).default(5),
  pismeSure: z.number().min(0).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Firin_kapasitesi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.tavaSayisi * input.tavaKapasite * 60) / Math.max(0.0001, input.pismeSure); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFirin_kapasitesi_hesaplama(input: Firin_kapasitesi_hesaplamaInput): Firin_kapasitesi_hesaplamaOutput {
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
    unit: "kg/h",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Firin_kapasitesi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Firin_kapasitesi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg/h",
  breakdownKeys: ["sonuc"],
} as const;

