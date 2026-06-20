// Auto-generated from lift-calculator-schema.json
import * as z from 'zod';

export interface Lift_calculatorInput {
  loadMass: number;
  carMass: number;
  acceleration: number;
  counterweightRatio: number;
  frictionForce: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Lift_calculatorInputSchema = z.object({
  loadMass: z.number().default(1000),
  carMass: z.number().default(500),
  acceleration: z.number().default(1.5),
  counterweightRatio: z.number().default(0.5),
  frictionForce: z.number().default(200),
  safetyFactor: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lift_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.counterweightRatio * (input.carMass + input.loadMass); results["counterweightMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["counterweightMass"] = Number.NaN; }
  try { const v = (input.carMass + input.loadMass - (toNumericFormulaValue(results["counterweightMass"]))) * 9.81; results["gravitationalForce"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gravitationalForce"] = Number.NaN; }
  try { const v = (input.carMass + input.loadMass + (toNumericFormulaValue(results["counterweightMass"]))) * input.acceleration; results["inertialForce"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inertialForce"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["gravitationalForce"])) + (toNumericFormulaValue(results["inertialForce"])) + input.frictionForce; results["totalForce"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalForce"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalForce"])) * input.safetyFactor; results["requiredForce"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredForce"] = Number.NaN; }
  return results;
}


export function calculateLift_calculator(input: Lift_calculatorInput): Lift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredForce"]);
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


export interface Lift_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
