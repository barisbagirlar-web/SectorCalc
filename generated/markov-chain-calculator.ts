// Auto-generated from markov-chain-calculator-schema.json
import * as z from 'zod';

export interface Markov_chain_calculatorInput {
  pAB: number;
  pBA: number;
  initA: number;
  steps: number;
}

export const Markov_chain_calculatorInputSchema = z.object({
  pAB: z.number().default(0.2),
  pBA: z.number().default(0.3),
  initA: z.number().default(1),
  steps: z.number().default(1),
});

function evaluateAllFormulas(input: Markov_chain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pBA / (input.pAB + input.pBA); results["steadyStateA"] = Number.isFinite(v) ? v : 0; } catch { results["steadyStateA"] = 0; }
  try { const v = input.pAB / (input.pAB + input.pBA); results["steadyStateB"] = Number.isFinite(v) ? v : 0; } catch { results["steadyStateB"] = 0; }
  try { const v = (results["steadyStateA"] ?? 0) + (input.initA - (results["steadyStateA"] ?? 0)) * Math.pow(1 - input.pAB - input.pBA, input.steps); results["stateAProb"] = Number.isFinite(v) ? v : 0; } catch { results["stateAProb"] = 0; }
  return results;
}


export function calculateMarkov_chain_calculator(input: Markov_chain_calculatorInput): Markov_chain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["stateAProb"] ?? 0;
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


export interface Markov_chain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
