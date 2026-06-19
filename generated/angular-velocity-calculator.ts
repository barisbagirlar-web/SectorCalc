// Auto-generated from angular-velocity-calculator-schema.json
import * as z from 'zod';

export interface Angular_velocity_calculatorInput {
  rotationalSpeed: number;
  radius: number;
  time: number;
  gearRatio: number;
  dataConfidence?: number;
}

export const Angular_velocity_calculatorInputSchema = z.object({
  rotationalSpeed: z.number().default(1500),
  radius: z.number().default(0.1),
  time: z.number().default(1),
  gearRatio: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Angular_velocity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.rotationalSpeed * 2 * Math.PI / 60) * input.gearRatio; results["angularVelocity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["angularVelocity"] = 0; }
  try { const v = (asFormulaNumber(results["angularVelocity"])) * input.radius; results["linearVelocity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["linearVelocity"] = 0; }
  try { const v = (asFormulaNumber(results["angularVelocity"])) ** 2 * input.radius; results["centripetalAcceleration"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["centripetalAcceleration"] = 0; }
  try { const v = (asFormulaNumber(results["angularVelocity"])) * input.time; results["angularDisplacement"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["angularDisplacement"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAngular_velocity_calculator(input: Angular_velocity_calculatorInput): Angular_velocity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["angularVelocity"]);
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


export interface Angular_velocity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
