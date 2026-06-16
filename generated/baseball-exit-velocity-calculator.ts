// Auto-generated from baseball-exit-velocity-calculator-schema.json
import * as z from 'zod';

export interface Baseball_exit_velocity_calculatorInput {
  ballMass: number;
  batMass: number;
  pitchSpeed: number;
  batSpeed: number;
  cor: number;
}

export const Baseball_exit_velocity_calculatorInputSchema = z.object({
  ballMass: z.number().default(5.125),
  batMass: z.number().default(28),
  pitchSpeed: z.number().default(90),
  batSpeed: z.number().default(70),
  cor: z.number().default(0.5),
});

function evaluateAllFormulas(input: Baseball_exit_velocity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.ballMass - input.cor*input.batMass) / (input.ballMass + input.batMass)) * (-input.pitchSpeed) + ((1+input.cor)*input.batMass / (input.ballMass + input.batMass)) * input.batSpeed; results["exitVelocity"] = Number.isFinite(v) ? v : 0; } catch { results["exitVelocity"] = 0; }
  try { const v = ((1+input.cor)*input.batMass / (input.ballMass + input.batMass)) * input.batSpeed; results["batContribution"] = Number.isFinite(v) ? v : 0; } catch { results["batContribution"] = 0; }
  try { const v = ((input.ballMass - input.cor*input.batMass) / (input.ballMass + input.batMass)) * (-input.pitchSpeed); results["pitchContribution"] = Number.isFinite(v) ? v : 0; } catch { results["pitchContribution"] = 0; }
  return results;
}


export function calculateBaseball_exit_velocity_calculator(input: Baseball_exit_velocity_calculatorInput): Baseball_exit_velocity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["exitVelocity"] ?? 0;
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


export interface Baseball_exit_velocity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
