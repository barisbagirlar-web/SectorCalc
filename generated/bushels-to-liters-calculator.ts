// Auto-generated from bushels-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Bushels_to_liters_calculatorInput {
  total_bushels: number;
  conversion_factor: number;
  batch_count: number;
  container_size: number;
}

export const Bushels_to_liters_calculatorInputSchema = z.object({
  total_bushels: z.number().default(1),
  conversion_factor: z.number().default(35.2391),
  batch_count: z.number().default(1),
  container_size: z.number().default(20),
});

function evaluateAllFormulas(input: Bushels_to_liters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_bushels * input.conversion_factor * input.batch_count; results["total_liters"] = Number.isFinite(v) ? v : 0; } catch { results["total_liters"] = 0; }
  try { const v = Math.ceil((results["total_liters"] ?? 0) / input.container_size); results["containers_needed"] = Number.isFinite(v) ? v : 0; } catch { results["containers_needed"] = 0; }
  return results;
}


export function calculateBushels_to_liters_calculator(input: Bushels_to_liters_calculatorInput): Bushels_to_liters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_liters"] ?? 0;
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


export interface Bushels_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
