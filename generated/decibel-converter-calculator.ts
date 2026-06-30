// Auto-generated from decibel-converter-calculator-schema.json
import * as z from 'zod';

export interface Decibel_converter_calculatorInput {
  dataConfidence?: number;
  oran: number;
  tip: number;
}

export const Decibel_converter_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  oran: z.number().min(0).default(100),
  tip: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Decibel_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["tip"] === 0 ? 10 * Math.log10(Math.max(0.0001, input["oran"])) : 20 * Math.log10(Math.max(0.0001, input["oran"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDecibel_converter_calculator(input: Decibel_converter_calculatorInput): Decibel_converter_calculatorOutput {
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

export interface Decibel_converter_calculatorOutput {
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

export const Decibel_converter_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "dB",
  breakdownKeys: [],
} as const;
