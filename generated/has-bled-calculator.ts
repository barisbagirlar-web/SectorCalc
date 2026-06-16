// Auto-generated from has-bled-calculator-schema.json
import * as z from 'zod';

export interface Has_bled_calculatorInput {
  hypertension: number;
  abnormalRenal: number;
  abnormalLiver: number;
  stroke: number;
  bleeding: number;
  labileINR: number;
  elderly: number;
  drugsAlcohol: number;
}

export const Has_bled_calculatorInputSchema = z.object({
  hypertension: z.number().default(0),
  abnormalRenal: z.number().default(0),
  abnormalLiver: z.number().default(0),
  stroke: z.number().default(0),
  bleeding: z.number().default(0),
  labileINR: z.number().default(0),
  elderly: z.number().default(0),
  drugsAlcohol: z.number().default(0),
});

function evaluateAllFormulas(input: Has_bled_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hypertension + input.abnormalRenal + input.abnormalLiver + input.stroke + input.bleeding + input.labileINR + input.elderly + input.drugsAlcohol; results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  try { const v = (results["totalScore"] ?? 0) >= 3 ? 'High risk' : (results["totalScore"] ?? 0) === 2 ? 'Moderate risk' : 'Low risk'; results["riskCategory"] = Number.isFinite(v) ? v : 0; } catch { results["riskCategory"] = 0; }
  return results;
}


export function calculateHas_bled_calculator(input: Has_bled_calculatorInput): Has_bled_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalScore"] ?? 0;
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


export interface Has_bled_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
