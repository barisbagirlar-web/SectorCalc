// Auto-generated from accuracy-calculator-schema.json
import * as z from 'zod';

export interface Accuracy_calculatorInput {
  true_value: number;
  measured_value: number;
  full_scale: number;
  tolerance_limit: number;
  calibration_offset: number;
}

export const Accuracy_calculatorInputSchema = z.object({
  true_value: z.number().default(100),
  measured_value: z.number().default(98),
  full_scale: z.number().default(200),
  tolerance_limit: z.number().default(2),
  calibration_offset: z.number().default(0),
});

function evaluateAllFormulas(input: Accuracy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.measured_value - input.calibration_offset - input.true_value; results["absolute_error"] = Number.isFinite(v) ? v : 0; } catch { results["absolute_error"] = 0; }
  try { const v = ((input.measured_value - input.calibration_offset - input.true_value) / input.true_value) * 100; results["relative_error_percent"] = Number.isFinite(v) ? v : 0; } catch { results["relative_error_percent"] = 0; }
  try { const v = 100 - Math.abs(((input.measured_value - input.calibration_offset - input.true_value) / input.true_value) * 100); results["accuracy_percent"] = Number.isFinite(v) ? v : 0; } catch { results["accuracy_percent"] = 0; }
  try { const v = (Math.abs(input.measured_value - input.calibration_offset - input.true_value) / input.full_scale) * 100; results["full_scale_error_percent"] = Number.isFinite(v) ? v : 0; } catch { results["full_scale_error_percent"] = 0; }
  try { const v = Math.abs(input.measured_value - input.calibration_offset - input.true_value) <= input.tolerance_limit ? 'Yes' : 'No'; results["within_tolerance"] = Number.isFinite(v) ? v : 0; } catch { results["within_tolerance"] = 0; }
  return results;
}


export function calculateAccuracy_calculator(input: Accuracy_calculatorInput): Accuracy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["accuracy_percent"] ?? 0;
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


export interface Accuracy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
