// Auto-generated from game-theory-calculator-schema.json
import * as z from 'zod';

export interface Game_theory_calculatorInput {
  payoff11: number;
  payoff12: number;
  payoff21: number;
  payoff22: number;
  dataConfidence?: number;
}

export const Game_theory_calculatorInputSchema = z.object({
  payoff11: z.number().default(0),
  payoff12: z.number().default(0),
  payoff21: z.number().default(0),
  payoff22: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Game_theory_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.payoff11 - input.payoff12 - input.payoff21 + input.payoff22; results["denom"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["denom"] = Number.NaN; }
  try { const v = (input.payoff22 - input.payoff21) / (input.payoff11 - input.payoff12 - input.payoff21 + input.payoff22); results["rowProb"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rowProb"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rowProb"])) * input.payoff11 + (1 - (toNumericFormulaValue(results["rowProb"]))) * input.payoff21; results["gameValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gameValue"] = Number.NaN; }
  try { const v = (input.payoff22 - input.payoff12) / (input.payoff11 - input.payoff12 - input.payoff21 + input.payoff22); results["colProb"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["colProb"] = Number.NaN; }
  return results;
}


export function calculateGame_theory_calculator(input: Game_theory_calculatorInput): Game_theory_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gameValue"]);
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


export interface Game_theory_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
