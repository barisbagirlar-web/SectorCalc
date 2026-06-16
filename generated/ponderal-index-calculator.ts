// Auto-generated from ponderal-index-calculator-schema.json
import * as z from 'zod';

export interface Ponderal_index_calculatorInput {
  mass_kg: number;
  height_cm: number;
  mass_lb: number;
  height_in: number;
}

export const Ponderal_index_calculatorInputSchema = z.object({
  mass_kg: z.number().default(70),
  height_cm: z.number().default(170),
  mass_lb: z.number().default(154.32),
  height_in: z.number().default(66.93),
});

function evaluateAllFormulas(input: Ponderal_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass_kg / ((input.height_cm / 100) ** 3); results["metricPI"] = Number.isFinite(v) ? v : 0; } catch { results["metricPI"] = 0; }
  try { const v = input.mass_lb / (input.height_in ** 3); results["imperialPI"] = Number.isFinite(v) ? v : 0; } catch { results["imperialPI"] = 0; }
  return results;
}


export function calculatePonderal_index_calculator(input: Ponderal_index_calculatorInput): Ponderal_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["metricPI"] ?? 0;
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


export interface Ponderal_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
