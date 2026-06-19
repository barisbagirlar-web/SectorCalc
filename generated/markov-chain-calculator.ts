// Auto-generated from markov-chain-calculator-schema.json
import * as z from 'zod';

export interface Markov_chain_calculatorInput {
  pAB: number;
  pBA: number;
  initA: number;
  steps: number;
  dataConfidence?: number;
}

export const Markov_chain_calculatorInputSchema = z.object({
  pAB: z.number().default(0.2),
  pBA: z.number().default(0.3),
  initA: z.number().default(1),
  steps: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Markov_chain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pBA / (input.pAB + input.pBA); results["steadyStateA"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["steadyStateA"] = 0; }
  try { const v = input.pAB / (input.pAB + input.pBA); results["steadyStateB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["steadyStateB"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMarkov_chain_calculator(input: Markov_chain_calculatorInput): Markov_chain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["steadyStateB"]);
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


export interface Markov_chain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
