// Auto-generated from baseball-exit-velocity-calculator-schema.json
import * as z from 'zod';

export interface Baseball_exit_velocity_calculatorInput {
  ballMass: number;
  batMass: number;
  pitchSpeed: number;
  batSpeed: number;
  cor: number;
  dataConfidence?: number;
}

export const Baseball_exit_velocity_calculatorInputSchema = z.object({
  ballMass: z.number().default(5.125),
  batMass: z.number().default(28),
  pitchSpeed: z.number().default(90),
  batSpeed: z.number().default(70),
  cor: z.number().default(0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baseball_exit_velocity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.ballMass - input.cor*input.batMass) / (input.ballMass + input.batMass)) * (-input.pitchSpeed) + ((1+input.cor)*input.batMass / (input.ballMass + input.batMass)) * input.batSpeed; results["exitVelocity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exitVelocity"] = 0; }
  try { const v = ((1+input.cor)*input.batMass / (input.ballMass + input.batMass)) * input.batSpeed; results["batContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["batContribution"] = 0; }
  try { const v = ((input.ballMass - input.cor*input.batMass) / (input.ballMass + input.batMass)) * (-input.pitchSpeed); results["pitchContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pitchContribution"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaseball_exit_velocity_calculator(input: Baseball_exit_velocity_calculatorInput): Baseball_exit_velocity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["exitVelocity"]);
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


export interface Baseball_exit_velocity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
