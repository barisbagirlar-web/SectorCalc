// Auto-generated from state-space-calculator-schema.json
import * as z from 'zod';

export interface State_space_calculatorInput {
  numStates: number;
  transitionProb: number;
  initialState: number;
  timeSteps: number;
  rewardPerState: number;
  discountFactor: number;
  dataConfidence?: number;
}

export const State_space_calculatorInputSchema = z.object({
  numStates: z.number().default(2),
  transitionProb: z.number().default(0.5),
  initialState: z.number().default(0),
  timeSteps: z.number().default(10),
  rewardPerState: z.number().default(1),
  discountFactor: z.number().default(0.9),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: State_space_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / input.numStates; results["steadyStateProb"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["steadyStateProb"] = Number.NaN; }
  try { const v = input.rewardPerState * (1 - input.discountFactor^input.timeSteps) / (1 - input.discountFactor); results["expectedDiscountedReward"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedDiscountedReward"] = Number.NaN; }
  try { const v = input.initialState; results["stateDistribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stateDistribution"] = Number.NaN; }
  return results;
}


export function calculateState_space_calculator(input: State_space_calculatorInput): State_space_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["steadyStateProb"]);
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


export interface State_space_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
