// Auto-generated from rate-law-calculator-schema.json
import * as z from 'zod';

export interface Rate_law_calculatorInput {
  initialConcentration: number;
  finalConcentration: number;
  time: number;
  reactionOrder: number;
  dataConfidence?: number;
}

export const Rate_law_calculatorInputSchema = z.object({
  initialConcentration: z.number().default(1),
  finalConcentration: z.number().default(0.5),
  time: z.number().default(10),
  reactionOrder: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rate_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialConcentration * input.finalConcentration * input.time * input.reactionOrder; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.initialConcentration * input.finalConcentration * input.time * input.reactionOrder; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRate_law_calculator(input: Rate_law_calculatorInput): Rate_law_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Rate_law_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
