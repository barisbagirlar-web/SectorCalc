// Auto-generated from shaft-design-calculator-schema.json
import * as z from 'zod';

export interface Shaft_design_calculatorInput {
  torque: number;
  bendingMoment: number;
  diameter: number;
  yieldStrength: number;
  safetyFactor: number;
}

export const Shaft_design_calculatorInputSchema = z.object({
  torque: z.number().default(100),
  bendingMoment: z.number().default(50),
  diameter: z.number().default(30),
  yieldStrength: z.number().default(250),
  safetyFactor: z.number().default(2),
});

function evaluateAllFormulas(input: Shaft_design_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bendingMoment * 1000 * 32) / (Math.PI * Math.pow(input.diameter, 3)); results["bendingStress"] = Number.isFinite(v) ? v : 0; } catch { results["bendingStress"] = 0; }
  try { const v = (input.torque * 1000 * 16) / (Math.PI * Math.pow(input.diameter, 3)); results["torsionalShear"] = Number.isFinite(v) ? v : 0; } catch { results["torsionalShear"] = 0; }
  try { const v = Math.sqrt(Math.pow((results["bendingStress"] ?? 0), 2) + 3 * Math.pow((results["torsionalShear"] ?? 0), 2)); results["vonMises"] = Number.isFinite(v) ? v : 0; } catch { results["vonMises"] = 0; }
  try { const v = input.yieldStrength / input.safetyFactor; results["allowable"] = Number.isFinite(v) ? v : 0; } catch { results["allowable"] = 0; }
  try { const v = (((results["allowable"] ?? 0) - (results["vonMises"] ?? 0)) / (results["allowable"] ?? 0)) * 100; results["margin"] = Number.isFinite(v) ? v : 0; } catch { results["margin"] = 0; }
  return results;
}


export function calculateShaft_design_calculator(input: Shaft_design_calculatorInput): Shaft_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["margin"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Shaft_design_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
