// Auto-generated from ballistic-pendulum-calculator-schema.json
import * as z from 'zod';

export interface Ballistic_pendulum_calculatorInput {
  projectile_mass: number;
  pendulum_mass: number;
  pendulum_length: number;
  angle: number;
  gravity: number;
  dataConfidence?: number;
}

export const Ballistic_pendulum_calculatorInputSchema = z.object({
  projectile_mass: z.number().default(0.01),
  pendulum_mass: z.number().default(2),
  pendulum_length: z.number().default(1.5),
  angle: z.number().default(30),
  gravity: z.number().default(9.81),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ballistic_pendulum_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.angle * Math.PI / 180; results["angle_rad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["angle_rad"] = 0; }
  try { const v = input.angle * Math.PI / 180; results["angle_rad_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["angle_rad_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBallistic_pendulum_calculator(input: Ballistic_pendulum_calculatorInput): Ballistic_pendulum_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["angle_rad_aux"]);
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


export interface Ballistic_pendulum_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
