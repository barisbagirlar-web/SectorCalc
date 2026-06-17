// Auto-generated from transition-fit-calculator-schema.json
import * as z from 'zod';

export interface Transition_fit_calculatorInput {
  basic_size: number;
  hole_upper_dev: number;
  hole_lower_dev: number;
  shaft_upper_dev: number;
  shaft_lower_dev: number;
}

export const Transition_fit_calculatorInputSchema = z.object({
  basic_size: z.number().default(50),
  hole_upper_dev: z.number().default(0.025),
  hole_lower_dev: z.number().default(0),
  shaft_upper_dev: z.number().default(0.018),
  shaft_lower_dev: z.number().default(0.002),
});

function evaluateAllFormulas(input: Transition_fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.basic_size + input.hole_upper_dev; results["holeMax"] = Number.isFinite(v) ? v : 0; } catch { results["holeMax"] = 0; }
  try { const v = input.basic_size + input.hole_lower_dev; results["holeMin"] = Number.isFinite(v) ? v : 0; } catch { results["holeMin"] = 0; }
  try { const v = input.basic_size + input.shaft_upper_dev; results["shaftMax"] = Number.isFinite(v) ? v : 0; } catch { results["shaftMax"] = 0; }
  try { const v = input.basic_size + input.shaft_lower_dev; results["shaftMin"] = Number.isFinite(v) ? v : 0; } catch { results["shaftMin"] = 0; }
  try { const v = (results["holeMax"] ?? 0) - (results["shaftMin"] ?? 0); results["maxClearance"] = Number.isFinite(v) ? v : 0; } catch { results["maxClearance"] = 0; }
  try { const v = (results["holeMin"] ?? 0) - (results["shaftMax"] ?? 0); results["minClearance"] = Number.isFinite(v) ? v : 0; } catch { results["minClearance"] = 0; }
  try { const v = ((results["maxClearance"] ?? 0) > 0 && (results["minClearance"] ?? 0) > 0) ? 'Clearance' : ((results["maxClearance"] ?? 0) < 0 && (results["minClearance"] ?? 0) < 0) ? 'Interference' : 'Transition'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateTransition_fit_calculator(input: Transition_fit_calculatorInput): Transition_fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Transition_fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
