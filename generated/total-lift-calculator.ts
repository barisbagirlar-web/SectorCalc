// Auto-generated from total-lift-calculator-schema.json
import * as z from 'zod';

export interface Total_lift_calculatorInput {
  loadMass: number;
  gravity: number;
  safetyFactor: number;
  additionalLoad: number;
  liftAcceleration: number;
  frictionCoefficient: number;
  dataConfidence?: number;
}

export const Total_lift_calculatorInputSchema = z.object({
  loadMass: z.number().default(1000),
  gravity: z.number().default(9.81),
  safetyFactor: z.number().default(1.5),
  additionalLoad: z.number().default(100),
  liftAcceleration: z.number().default(0.5),
  frictionCoefficient: z.number().default(0.05),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Total_lift_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.loadMass + input.additionalLoad) * input.gravity; results["netWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netWeight"] = Number.NaN; }
  try { const v = (input.loadMass + input.additionalLoad) * (input.gravity + input.liftAcceleration); results["dynamicForce"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dynamicForce"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dynamicForce"])) * (1 + input.frictionCoefficient) * input.safetyFactor; results["totalLiftForce"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLiftForce"] = Number.NaN; }
  return results;
}


export function calculateTotal_lift_calculator(input: Total_lift_calculatorInput): Total_lift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLiftForce"]);
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


export interface Total_lift_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
