// Auto-generated from darcy-weisbach-calculator-schema.json
import * as z from 'zod';

export interface Darcy_weisbach_calculatorInput {
  pipeDiameter: number;
  pipeLength: number;
  frictionFactor: number;
  fluidDensity: number;
  flowRate: number;
}

export const Darcy_weisbach_calculatorInputSchema = z.object({
  pipeDiameter: z.number().default(0.1),
  pipeLength: z.number().default(100),
  frictionFactor: z.number().default(0.02),
  fluidDensity: z.number().default(1000),
  flowRate: z.number().default(0.01),
});

function evaluateAllFormulas(input: Darcy_weisbach_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate / (Math.PI * (input.pipeDiameter ** 2) / 4); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = input.frictionFactor * (input.pipeLength / input.pipeDiameter) * 0.5 * input.fluidDensity * ((results["velocity"] ?? 0) ** 2); results["pressureLoss"] = Number.isFinite(v) ? v : 0; } catch { results["pressureLoss"] = 0; }
  try { const v = (results["pressureLoss"] ?? 0) / (input.fluidDensity * 9.81); results["headLoss"] = Number.isFinite(v) ? v : 0; } catch { results["headLoss"] = 0; }
  return results;
}


export function calculateDarcy_weisbach_calculator(input: Darcy_weisbach_calculatorInput): Darcy_weisbach_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pressureLoss"] ?? 0;
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


export interface Darcy_weisbach_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
