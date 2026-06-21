// Auto-generated from silage-weight-calculator-schema.json
import * as z from 'zod';

export interface Silage_weight_calculatorInput {
  siloHacim: number;
  sikistirmaYogunlugu: number;
  dataConfidence?: number;
}

export const Silage_weight_calculatorInputSchema = z.object({
  siloHacim: z.number().min(0).default(500),
  sikistirmaYogunlugu: z.number().min(0).default(700),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Silage_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.siloHacim * input.sikistirmaYogunlugu; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSilage_weight_calculator(input: Silage_weight_calculatorInput): Silage_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Silage_weight_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Silage_weight_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg",
  breakdownKeys: ["sonuc"],
} as const;

