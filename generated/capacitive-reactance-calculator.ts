// Auto-generated from capacitive-reactance-calculator-schema.json
import * as z from 'zod';

export interface Capacitive_reactance_calculatorInput {
  dataConfidence?: number;
  frekans: number;
  kapasite: number;
}

export const Capacitive_reactance_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  frekans: z.number().min(0).default(50),
  kapasite: z.number().min(0).default(0.000001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Capacitive_reactance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / Math.max(0.0001, (2 * Math.PI * input["frekans"] * input["kapasite"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCapacitive_reactance_calculator(input: Capacitive_reactance_calculatorInput): Capacitive_reactance_calculatorOutput {
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
    unit: "ohms",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Capacitive_reactance_calculatorOutput {
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

export const Capacitive_reactance_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "ohms",
  breakdownKeys: [],
} as const;
