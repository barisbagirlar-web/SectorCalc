// Auto-generated from sqnr-calculator-schema.json
import * as z from 'zod';

export interface Sqnr_calculatorInput {
  dataConfidence?: number;
  bitSayisi: number;
}

export const Sqnr_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  bitSayisi: z.number().min(1).max(32).default(16),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sqnr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 6.02 * input["bitSayisi"] + 1.76; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSqnr_calculator(input: Sqnr_calculatorInput): Sqnr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low SNR indicates poor signal quality.","High Q indicates narrow bandwidth."];
  const suggestedActions: string[] = ["Use proper shielding for sensitive measurements.","Consider efficiency losses in energy calculations."];
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
    unit: "dB",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Sqnr_calculatorOutput {
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

export const Sqnr_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "dB",
  breakdownKeys: [],
} as const;
