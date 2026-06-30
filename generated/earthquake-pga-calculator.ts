// Auto-generated from earthquake-pga-calculator-schema.json
import * as z from 'zod';

export interface Earthquake_pga_calculatorInput {
  dataConfidence?: number;
  momentMagnitudu: number;
  mesafe: number;
  zeminKatsayisi: number;
}

export const Earthquake_pga_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  momentMagnitudu: z.number().min(0).max(10).default(7),
  mesafe: z.number().min(0).default(50),
  zeminKatsayisi: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Earthquake_pga_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["zeminKatsayisi"] * Math.exp(0.5 * input["momentMagnitudu"] - 2.0 * Math.log(Math.max(1, input["mesafe"] + 10))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateEarthquake_pga_calculator(input: Earthquake_pga_calculatorInput): Earthquake_pga_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low SLA indicates service reliability issue.","High latency degrades user experience."];
  const suggestedActions: string[] = ["Monitor system performance regularly.","Implement redundancy for critical infrastructure."];
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
    unit: "g",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Earthquake_pga_calculatorOutput {
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

export const Earthquake_pga_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "g",
  breakdownKeys: [],
} as const;
