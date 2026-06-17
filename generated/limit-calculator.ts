// Auto-generated from limit-calculator-schema.json
import * as z from 'zod';

export interface Limit_calculatorInput {
  numCoeff0: number;
  numCoeff1: number;
  numCoeff2: number;
  denCoeff0: number;
  denCoeff1: number;
  denCoeff2: number;
  approachPoint: number;
  epsilon: number;
}

export const Limit_calculatorInputSchema = z.object({
  numCoeff0: z.number().default(0),
  numCoeff1: z.number().default(0),
  numCoeff2: z.number().default(0),
  denCoeff0: z.number().default(0),
  denCoeff1: z.number().default(0),
  denCoeff2: z.number().default(0),
  approachPoint: z.number().default(0),
  epsilon: z.number().default(0.0001),
});

function evaluateAllFormulas(input: Limit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.approachPoint - input.epsilon; results["xLeft"] = Number.isFinite(v) ? v : 0; } catch { results["xLeft"] = 0; }
  try { const v = input.approachPoint + input.epsilon; results["xRight"] = Number.isFinite(v) ? v : 0; } catch { results["xRight"] = 0; }
  try { const v = input.numCoeff0 + input.numCoeff1 * (results["xLeft"] ?? 0) + input.numCoeff2 * (results["xLeft"] ?? 0) ** 2; results["leftNumerator"] = Number.isFinite(v) ? v : 0; } catch { results["leftNumerator"] = 0; }
  try { const v = input.denCoeff0 + input.denCoeff1 * (results["xLeft"] ?? 0) + input.denCoeff2 * (results["xLeft"] ?? 0) ** 2; results["leftDenominator"] = Number.isFinite(v) ? v : 0; } catch { results["leftDenominator"] = 0; }
  try { const v = (results["leftNumerator"] ?? 0) / (results["leftDenominator"] ?? 0); results["leftLimit"] = Number.isFinite(v) ? v : 0; } catch { results["leftLimit"] = 0; }
  try { const v = input.numCoeff0 + input.numCoeff1 * (results["xRight"] ?? 0) + input.numCoeff2 * (results["xRight"] ?? 0) ** 2; results["rightNumerator"] = Number.isFinite(v) ? v : 0; } catch { results["rightNumerator"] = 0; }
  try { const v = input.denCoeff0 + input.denCoeff1 * (results["xRight"] ?? 0) + input.denCoeff2 * (results["xRight"] ?? 0) ** 2; results["rightDenominator"] = Number.isFinite(v) ? v : 0; } catch { results["rightDenominator"] = 0; }
  try { const v = (results["rightNumerator"] ?? 0) / (results["rightDenominator"] ?? 0); results["rightLimit"] = Number.isFinite(v) ? v : 0; } catch { results["rightLimit"] = 0; }
  try { const v = ((results["leftLimit"] ?? 0) + (results["rightLimit"] ?? 0)) / 2; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = (results["leftLimit"] ?? 0); results["breakdown_0"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_0"] = 0; }
  try { const v = (results["rightLimit"] ?? 0); results["breakdown_1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_1"] = 0; }
  try { const v = Math.abs((results["leftLimit"] ?? 0) - (results["rightLimit"] ?? 0)); results["breakdown_2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_2"] = 0; }
  results["Left_hand_limit"] = 0;
  results["Right_hand_limit"] = 0;
  results["Absolute_difference_between_left_and_rig"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateLimit_calculator(input: Limit_calculatorInput): Limit_calculatorOutput {
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


export interface Limit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
