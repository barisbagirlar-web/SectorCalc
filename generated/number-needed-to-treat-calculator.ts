// Auto-generated from number-needed-to-treat-calculator-schema.json
import * as z from 'zod';

export interface Number_needed_to_treat_calculatorInput {
  controlEvents: number;
  controlTotal: number;
  treatmentEvents: number;
  treatmentTotal: number;
}

export const Number_needed_to_treat_calculatorInputSchema = z.object({
  controlEvents: z.number().default(20),
  controlTotal: z.number().default(100),
  treatmentEvents: z.number().default(15),
  treatmentTotal: z.number().default(100),
});

function evaluateAllFormulas(input: Number_needed_to_treat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.controlEvents / input.controlTotal * 100; results["controlRate"] = Number.isFinite(v) ? v : 0; } catch { results["controlRate"] = 0; }
  try { const v = input.treatmentEvents / input.treatmentTotal * 100; results["treatmentRate"] = Number.isFinite(v) ? v : 0; } catch { results["treatmentRate"] = 0; }
  try { const v = (results["controlRate"] ?? 0) - (results["treatmentRate"] ?? 0); results["arr"] = Number.isFinite(v) ? v : 0; } catch { results["arr"] = 0; }
  try { const v = (results["arr"] ?? 0) > 0 ? Math.round(100 / (results["arr"] ?? 0)) : 'N/A'; results["nnt"] = Number.isFinite(v) ? v : 0; } catch { results["nnt"] = 0; }
  return results;
}


export function calculateNumber_needed_to_treat_calculator(input: Number_needed_to_treat_calculatorInput): Number_needed_to_treat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["nnt"] ?? 0;
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


export interface Number_needed_to_treat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
