// Auto-generated from adrenal-fatigue-calculator-schema.json
import * as z from 'zod';

export interface Adrenal_fatigue_calculatorInput {
  shift_length: number;
  consecutive_shifts: number;
  rest_between_shifts: number;
  noise_level: number;
  temperature: number;
  load_factor: number;
}

export const Adrenal_fatigue_calculatorInputSchema = z.object({
  shift_length: z.number().default(8),
  consecutive_shifts: z.number().default(5),
  rest_between_shifts: z.number().default(16),
  noise_level: z.number().default(70),
  temperature: z.number().default(22),
  load_factor: z.number().default(1),
});

function evaluateAllFormulas(input: Adrenal_fatigue_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.shift_length * input.load_factor * Math.log(input.noise_level + 1) * Math.sqrt(input.temperature ** 2 + 1) / (input.rest_between_shifts + 1)) + input.consecutive_shifts * 2; results["fatigue_index"] = Number.isFinite(v) ? v : 0; } catch { results["fatigue_index"] = 0; }
  try { const v = input.shift_length * input.load_factor / (input.rest_between_shifts + 1) * 10; results["shift_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["shift_contribution"] = 0; }
  try { const v = Math.log(input.noise_level + 1) * Math.sqrt(input.temperature ** 2 + 1) * 5; results["environment_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["environment_contribution"] = 0; }
  try { const v = input.consecutive_shifts * 2; results["cumulative_contribution"] = Number.isFinite(v) ? v : 0; } catch { results["cumulative_contribution"] = 0; }
  return results;
}


export function calculateAdrenal_fatigue_calculator(input: Adrenal_fatigue_calculatorInput): Adrenal_fatigue_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fatigue_index"] ?? 0;
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


export interface Adrenal_fatigue_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
