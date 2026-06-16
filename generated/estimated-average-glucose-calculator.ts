// Auto-generated from estimated-average-glucose-calculator-schema.json
import * as z from 'zod';

export interface Estimated_average_glucose_calculatorInput {
  hba1c: number;
  factor_mgdl: number;
  offset_mgdl: number;
  factor_mmol: number;
  offset_mmol: number;
}

export const Estimated_average_glucose_calculatorInputSchema = z.object({
  hba1c: z.number().default(7),
  factor_mgdl: z.number().default(28.7),
  offset_mgdl: z.number().default(-46.7),
  factor_mmol: z.number().default(1.59),
  offset_mmol: z.number().default(-2.59),
});

function evaluateAllFormulas(input: Estimated_average_glucose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.factor_mgdl * input.hba1c + input.offset_mgdl; results["eag_mgdl"] = Number.isFinite(v) ? v : 0; } catch { results["eag_mgdl"] = 0; }
  try { const v = input.factor_mmol * input.hba1c + input.offset_mmol; results["eag_mmol"] = Number.isFinite(v) ? v : 0; } catch { results["eag_mmol"] = 0; }
  return results;
}


export function calculateEstimated_average_glucose_calculator(input: Estimated_average_glucose_calculatorInput): Estimated_average_glucose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["eag_mgdl"] ?? 0;
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


export interface Estimated_average_glucose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
