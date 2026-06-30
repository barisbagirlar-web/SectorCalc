// Auto-generated from normal-shock-wave-pressure-jump-calculator-schema.json
import * as z from 'zod';

export interface Normal_shock_wave_pressure_jump_calculatorInput {
  dataConfidence?: number;
  mach: number;
  basinc1: number;
  k: number;
}

export const Normal_shock_wave_pressure_jump_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  mach: z.number().min(1).default(2),
  basinc1: z.number().min(0).default(50000),
  k: z.number().min(0).default(1.4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Normal_shock_wave_pressure_jump_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["basinc1"] * (1 + (2 * input["k"] / (input["k"] + 1)) * (Math.pow(input["mach"], 2) - 1)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateNormal_shock_wave_pressure_jump_calculator(input: Normal_shock_wave_pressure_jump_calculatorInput): Normal_shock_wave_pressure_jump_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Normal_shock_wave_pressure_jump_calculatorOutput {
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

export const Normal_shock_wave_pressure_jump_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: [],
} as const;
