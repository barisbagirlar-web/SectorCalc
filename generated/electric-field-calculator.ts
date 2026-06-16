// Auto-generated from electric-field-calculator-schema.json
import * as z from 'zod';

export interface Electric_field_calculatorInput {
  Q1: number;
  r1: number;
  Q2: number;
  r2: number;
  theta: number;
  epsilon_r: number;
}

export const Electric_field_calculatorInputSchema = z.object({
  Q1: z.number().default(0.000001),
  r1: z.number().default(1),
  Q2: z.number().default(-0.000001),
  r2: z.number().default(1),
  theta: z.number().default(90),
  epsilon_r: z.number().default(1),
});

function evaluateAllFormulas(input: Electric_field_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1/(4*Math.PI*8.854e-12*input.epsilon_r); results["k"] = Number.isFinite(v) ? v : 0; } catch { results["k"] = 0; }
  try { const v = (results["k"] ?? 0)*Math.abs(input.Q1)/(input.r1**2); results["E1"] = Number.isFinite(v) ? v : 0; } catch { results["E1"] = 0; }
  try { const v = (results["k"] ?? 0)*Math.abs(input.Q2)/(input.r2**2); results["E2"] = Number.isFinite(v) ? v : 0; } catch { results["E2"] = 0; }
  try { const v = input.theta*Math.PI/180; results["thetaRad"] = Number.isFinite(v) ? v : 0; } catch { results["thetaRad"] = 0; }
  try { const v = Math.sqrt((results["E1"] ?? 0)**2 + (results["E2"] ?? 0)**2 + 2*(results["E1"] ?? 0)*(results["E2"] ?? 0)*Math.cos((results["thetaRad"] ?? 0))); results["E_resultant"] = Number.isFinite(v) ? v : 0; } catch { results["E_resultant"] = 0; }
  return results;
}


export function calculateElectric_field_calculator(input: Electric_field_calculatorInput): Electric_field_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["E_resultant"] ?? 0;
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


export interface Electric_field_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
