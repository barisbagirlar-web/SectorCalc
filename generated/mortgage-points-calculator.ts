// Auto-generated from mortgage-points-calculator-schema.json
import * as z from 'zod';

export interface Mortgage_points_calculatorInput {
  kredi: number;
  puanOrani: number;
  aylikTasarruf: number;
  dataConfidence?: number;
}

export const Mortgage_points_calculatorInputSchema = z.object({
  kredi: z.number().min(0).default(1000000),
  puanOrani: z.number().min(0).default(2),
  aylikTasarruf: z.number().min(0).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mortgage_points_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kredi * input.puanOrani / 100; results["maliyet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maliyet"] = Number.NaN; }
  try { const v = (input.kredi * input.puanOrani / 100) / Math.max(1, input.aylikTasarruf); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMortgage_points_calculator(input: Mortgage_points_calculatorInput): Mortgage_points_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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
    unit: "months",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Mortgage_points_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mortgage_points_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "months",
  breakdownKeys: ["sonuc"],
} as const;

