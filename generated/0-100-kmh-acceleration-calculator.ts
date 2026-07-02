// Auto-generated from 0-100-kmh-acceleration-calculator-schema.json
import * as z from 'zod';

export interface _0_100_kmh_acceleration_calculatorInput {
  dataConfidence?: number;
  kutle: number;
  tork: number;
  tractionCoefficient: number;
  havaDirenci: number;
}

export const _0_100_kmh_acceleration_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kutle: z.number().min(0).default(1500),
  tork: z.number().min(0).default(300),
  tractionCoefficient: z.number().min(0).default(0.8),
  havaDirenci: z.number().min(0).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _0_100_kmh_acceleration_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input["tork"] * input["tractionCoefficient"]) - input["havaDirenci"]) / Math.max(0.0001, input["kutle"]); results["ivme"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ivme"] = Number.NaN; }
  try { const v = (100 / 3.6) / Math.max(0.0001, results["ivme"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculate_0_100_kmh_acceleration_calculator(input: _0_100_kmh_acceleration_calculatorInput): _0_100_kmh_acceleration_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High fuel/energy consumption indicates efficiency losses."];
  const suggestedActions: string[] = ["Regular maintenance improves overall equipment efficiency.","Simulate real-world driving conditions for accurate range estimates."];
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface _0_100_kmh_acceleration_calculatorOutput {
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

export const _0_100_kmh_acceleration_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: ["ivme"],
} as const;
