// Auto-generated from state-space-calculator-schema.json
import * as z from 'zod';

export interface State_space_calculatorInput {
  numStates: number;
  transitionProb: number;
  initialState: number;
  timeSteps: number;
  rewardPerState: number;
  discountFactor: number;
}

export const State_space_calculatorInputSchema = z.object({
  numStates: z.number().default(2),
  transitionProb: z.number().default(0.5),
  initialState: z.number().default(0),
  timeSteps: z.number().default(10),
  rewardPerState: z.number().default(1),
  discountFactor: z.number().default(0.9),
});

function evaluateAllFormulas(input: State_space_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rewardPerState * (1 - Math.pow(input.discountFactor, input.timeSteps)) / (1 - input.discountFactor); results["expectedReward"] = Number.isFinite(v) ? v : 0; } catch { results["expectedReward"] = 0; }
  try { const v = 1 / input.numStates; results["steadyStateProb"] = Number.isFinite(v) ? v : 0; } catch { results["steadyStateProb"] = 0; }
  try { const v = Array.from({length: input.numStates}, (_, i) => i === input.initialState ? 1 : 0); results["stateDistribution"] = Number.isFinite(v) ? v : 0; } catch { results["stateDistribution"] = 0; }
  results["Expected_total_discounted_reward_over_ti"] = 0;
  results["Steady_state_probability_per_state"] = 0;
  results["Initial_state_distribution_vector"] = 0;
  return results;
}


export function calculateState_space_calculator(input: State_space_calculatorInput): State_space_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["expectedReward"] ?? 0;
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


export interface State_space_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
