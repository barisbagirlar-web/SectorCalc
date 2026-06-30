// Auto-generated from photoelectric-effect-calculator-schema.json
import * as z from 'zod';

export interface Photoelectric_effect_calculatorInput {
  dataConfidence?: number;
  frekans: number;
  esikEnerji: number;
}

export const Photoelectric_effect_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  frekans: z.number().min(0).default(1000000000000000),
  esikEnerji: z.number().min(0).default(4e-19),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Photoelectric_effect_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 6.626e-34; results["h"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["h"] = Number.NaN; }
  try { const v = Math.max(0, (6.626e-34 * input["frekans"]) - input["esikEnerji"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePhotoelectric_effect_calculator(input: Photoelectric_effect_calculatorInput): Photoelectric_effect_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "J",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Photoelectric_effect_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Photoelectric_effect_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "J",
  breakdownKeys: ["h"],
} as const;
