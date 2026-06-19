// Auto-generated from rocket-propulsion-calculator-schema.json
import * as z from 'zod';

export interface Rocket_propulsion_calculatorInput {
  initialMass: number;
  finalMass: number;
  specificImpulse: number;
  gravitationalAcceleration: number;
  massFlowRate: number;
  dataConfidence?: number;
}

export const Rocket_propulsion_calculatorInputSchema = z.object({
  initialMass: z.number().default(50000),
  finalMass: z.number().default(10000),
  specificImpulse: z.number().default(300),
  gravitationalAcceleration: z.number().default(9.81),
  massFlowRate: z.number().default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rocket_propulsion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialMass - input.finalMass; results["propellantMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["propellantMass"] = 0; }
  try { const v = input.initialMass / input.finalMass; results["massRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["massRatio"] = 0; }
  try { const v = input.specificImpulse * input.gravitationalAcceleration; results["exhaustVelocity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exhaustVelocity"] = 0; }
  try { const v = input.massFlowRate * (asFormulaNumber(results["exhaustVelocity"])); results["thrust"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["thrust"] = 0; }
  try { const v = (asFormulaNumber(results["propellantMass"])) / input.massFlowRate; results["burnTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["burnTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRocket_propulsion_calculator(input: Rocket_propulsion_calculatorInput): Rocket_propulsion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["burnTime"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Rocket_propulsion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
