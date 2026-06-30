// Auto-generated from noise-propagation-calculator-schema.json
import * as z from 'zod';

export interface Noise_propagation_calculatorInput {
  dataConfidence?: number;
  sesGucu: number;
  mesafe: number;
  zeminZayiflama: number;
  engelZayiflama: number;
}

export const Noise_propagation_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  sesGucu: z.number().min(0).default(100),
  mesafe: z.number().min(0).default(50),
  zeminZayiflama: z.number().min(0).default(3),
  engelZayiflama: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Noise_propagation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["sesGucu"] - 20 * Math.log10(Math.max(1, input["mesafe"])) - 11 - input["zeminZayiflama"] - input["engelZayiflama"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateNoise_propagation_calculator(input: Noise_propagation_calculatorInput): Noise_propagation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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

export interface Noise_propagation_calculatorOutput {
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

export const Noise_propagation_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "dB",
  breakdownKeys: [],
} as const;
