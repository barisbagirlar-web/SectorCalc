// Auto-generated from pull-up-calculator-schema.json
import * as z from 'zod';

export interface Pull_up_calculatorInput {
  loadWeight: number;
  inclineAngle: number;
  frictionCoefficient: number;
  mechanicalAdvantage: number;
}

export const Pull_up_calculatorInputSchema = z.object({
  loadWeight: z.number().default(100),
  inclineAngle: z.number().default(30),
  frictionCoefficient: z.number().default(0.2),
  mechanicalAdvantage: z.number().default(1),
});

function evaluateAllFormulas(input: Pull_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadWeight * 9.81 * Math.sin(input.inclineAngle * Math.PI / 180); results["gravitationalForceComponent"] = Number.isFinite(v) ? v : 0; } catch { results["gravitationalForceComponent"] = 0; }
  try { const v = input.frictionCoefficient * input.loadWeight * 9.81 * Math.cos(input.inclineAngle * Math.PI / 180); results["frictionForce"] = Number.isFinite(v) ? v : 0; } catch { results["frictionForce"] = 0; }
  try { const v = ((results["gravitationalForceComponent"] ?? 0) + (results["frictionForce"] ?? 0)) / input.mechanicalAdvantage; results["totalRequiredForce"] = Number.isFinite(v) ? v : 0; } catch { results["totalRequiredForce"] = 0; }
  return results;
}


export function calculatePull_up_calculator(input: Pull_up_calculatorInput): Pull_up_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRequiredForce"] ?? 0;
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


export interface Pull_up_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
