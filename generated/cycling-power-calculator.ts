// Auto-generated from cycling-power-calculator-schema.json
import * as z from 'zod';

export interface Cycling_power_calculatorInput {
  total_mass: number;
  speed: number;
  gradient: number;
  wind_speed: number;
  rolling_resistance_coefficient: number;
  air_density: number;
  CdA: number;
  drivetrain_efficiency: number;
  dataConfidence?: number;
}

export const Cycling_power_calculatorInputSchema = z.object({
  total_mass: z.number().default(80),
  speed: z.number().default(30),
  gradient: z.number().default(0),
  wind_speed: z.number().default(0),
  rolling_resistance_coefficient: z.number().default(0.005),
  air_density: z.number().default(1.225),
  CdA: z.number().default(0.3),
  drivetrain_efficiency: z.number().default(0.95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cycling_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.air_density * input.CdA * ((input.speed / 3.6 + input.wind_speed / 3.6) ** 2) * (input.speed / 3.6); results["air_resistance_power"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["air_resistance_power"] = Number.NaN; }
  try { const v = (input.rolling_resistance_coefficient * input.total_mass * 9.81) * (input.speed / 3.6); results["rolling_resistance_power"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rolling_resistance_power"] = Number.NaN; }
  return results;
}


export function calculateCycling_power_calculator(input: Cycling_power_calculatorInput): Cycling_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rolling_resistance_power"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cycling_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
