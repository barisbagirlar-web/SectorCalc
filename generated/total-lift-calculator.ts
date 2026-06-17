// @ts-nocheck
// Auto-generated from total-lift-calculator-schema.json
import * as z from 'zod';

export interface Total_lift_calculatorInput {
  loadMass: number;
  gravity: number;
  safetyFactor: number;
  additionalLoad: number;
  liftAcceleration: number;
  frictionCoefficient: number;
}

export const Total_lift_calculatorInputSchema = z.object({
  loadMass: z.number().default(1000),
  gravity: z.number().default(9.81),
  safetyFactor: z.number().default(1.5),
  additionalLoad: z.number().default(100),
  liftAcceleration: z.number().default(0.5),
  frictionCoefficient: z.number().default(0.05),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Total_lift_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.loadMass + input.additionalLoad) * input.gravity; results["netWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netWeight"] = 0; }
  try { const v = (input.loadMass + input.additionalLoad) * (input.gravity + input.liftAcceleration); results["dynamicForce"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dynamicForce"] = 0; }
  try { const v = (asFormulaNumber(results["dynamicForce"])) * (1 + input.frictionCoefficient) * input.safetyFactor; results["totalLiftForce"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLiftForce"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTotal_lift_calculator(input: Total_lift_calculatorInput): Total_lift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLiftForce"]);
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


export interface Total_lift_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
