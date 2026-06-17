// @ts-nocheck
// Auto-generated from shooting-calculator-schema.json
import * as z from 'zod';

export interface Shooting_calculatorInput {
  initialVelocity: number;
  angle: number;
  mass: number;
  gravity: number;
  launchHeight: number;
}

export const Shooting_calculatorInputSchema = z.object({
  initialVelocity: z.number().default(100),
  angle: z.number().default(45),
  mass: z.number().default(0.01),
  gravity: z.number().default(9.81),
  launchHeight: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Shooting_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 0.5 * input.mass * input.initialVelocity * input.initialVelocity; results["kineticEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["kineticEnergy"] = 0; }
  try { const v = 0.5 * input.mass * input.initialVelocity * input.initialVelocity; results["kineticEnergy_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["kineticEnergy_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateShooting_calculator(input: Shooting_calculatorInput): Shooting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["kineticEnergy_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Shooting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
