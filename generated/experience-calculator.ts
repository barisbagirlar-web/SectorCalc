// Auto-generated from experience-calculator-schema.json
import * as z from 'zod';

export interface Experience_calculatorInput {
  firstUnitTime: number;
  learningRate: number;
  cumulativeUnits: number;
}

export const Experience_calculatorInputSchema = z.object({
  firstUnitTime: z.number().default(10),
  learningRate: z.number().default(80),
  cumulativeUnits: z.number().default(100),
});

function evaluateAllFormulas(input: Experience_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log(input.learningRate / 100) / Math.log(2); results["b"] = Number.isFinite(v) ? v : 0; } catch { results["b"] = 0; }
  try { const v = input.firstUnitTime * ((input.cumulativeUnits + 0.5) ** ((results["b"] ?? 0) + 1) - 0.5 ** ((results["b"] ?? 0) + 1)) / ((results["b"] ?? 0) + 1); results["totalTimeApprox"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeApprox"] = 0; }
  try { const v = (results["totalTimeApprox"] ?? 0) / input.cumulativeUnits; results["avgTime"] = Number.isFinite(v) ? v : 0; } catch { results["avgTime"] = 0; }
  try { const v = input.firstUnitTime * input.cumulativeUnits ** (results["b"] ?? 0); results["timeLastUnit"] = Number.isFinite(v) ? v : 0; } catch { results["timeLastUnit"] = 0; }
  return results;
}


export function calculateExperience_calculator(input: Experience_calculatorInput): Experience_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["avgTime"] ?? 0;
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


export interface Experience_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
