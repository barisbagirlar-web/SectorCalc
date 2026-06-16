// Auto-generated from anxiety-calculator-schema.json
import * as z from 'zod';

export interface Anxiety_calculatorInput {
  measurement_variance: number;
  operator_error_rate: number;
  machine_downtime: number;
  defect_rate: number;
  process_temperature_variance: number;
  noise_level: number;
}

export const Anxiety_calculatorInputSchema = z.object({
  measurement_variance: z.number().default(0.1),
  operator_error_rate: z.number().default(2),
  machine_downtime: z.number().default(0.05),
  defect_rate: z.number().default(1.5),
  process_temperature_variance: z.number().default(2.1),
  noise_level: z.number().default(75),
});

function evaluateAllFormulas(input: Anxiety_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.2 * Math.log(input.operator_error_rate + 1); results["human_factor"] = Number.isFinite(v) ? v : 0; } catch { results["human_factor"] = 0; }
  try { const v = 0.3 * input.machine_downtime * 100; results["machine_factor"] = Number.isFinite(v) ? v : 0; } catch { results["machine_factor"] = 0; }
  try { const v = 0.25 * Math.sqrt(input.measurement_variance); results["measurement_factor"] = Number.isFinite(v) ? v : 0; } catch { results["measurement_factor"] = 0; }
  try { const v = 0.15 * input.process_temperature_variance + 0.1 * Math.max(0, (input.noise_level - 70) / 10); results["environmental_factor"] = Number.isFinite(v) ? v : 0; } catch { results["environmental_factor"] = 0; }
  try { const v = (0.2 * Math.log(input.operator_error_rate + 1)) + (0.3 * input.machine_downtime * 100) + (0.25 * Math.sqrt(input.measurement_variance)) + (0.15 * input.process_temperature_variance) + (0.1 * Math.max(0, (input.noise_level - 70) / 10)); results["anxiety_index"] = Number.isFinite(v) ? v : 0; } catch { results["anxiety_index"] = 0; }
  return results;
}


export function calculateAnxiety_calculator(input: Anxiety_calculatorInput): Anxiety_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["anxiety_index"] ?? 0;
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


export interface Anxiety_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
