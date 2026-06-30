// Auto-generated from signal-to-noise-ratio-calculator-schema.json
import * as z from 'zod';

export interface Signal_to_noise_ratio_calculatorInput {
  dataConfidence?: number;
  sinyalGuc: number;
  gurultuGuc: number;
}

export const Signal_to_noise_ratio_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  sinyalGuc: z.number().min(0).default(0.001),
  gurultuGuc: z.number().min(0).default(0.000001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Signal_to_noise_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * Math.log10(Math.max(0.0001, input["sinyalGuc"] / Math.max(0.0001, input["gurultuGuc"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSignal_to_noise_ratio_calculator(input: Signal_to_noise_ratio_calculatorInput): Signal_to_noise_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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

export interface Signal_to_noise_ratio_calculatorOutput {
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

export const Signal_to_noise_ratio_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "dB",
  breakdownKeys: [],
} as const;
