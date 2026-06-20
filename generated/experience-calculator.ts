// Auto-generated from experience-calculator-schema.json
import * as z from 'zod';

export interface Experience_calculatorInput {
  firstUnitTime: number;
  learningRate: number;
  cumulativeUnits: number;
  dataConfidence?: number;
}

export const Experience_calculatorInputSchema = z.object({
  firstUnitTime: z.number().default(10),
  learningRate: z.number().default(80),
  cumulativeUnits: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Experience_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.firstUnitTime * (input.learningRate / 100) * input.cumulativeUnits; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.firstUnitTime * (input.learningRate / 100) * input.cumulativeUnits; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateExperience_calculator(input: Experience_calculatorInput): Experience_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Experience_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
