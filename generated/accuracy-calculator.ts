// Auto-generated from accuracy-calculator-schema.json
import * as z from 'zod';

export interface Accuracy_calculatorInput {
  true_value: number;
  measured_value: number;
  full_scale: number;
  tolerance_limit: number;
  calibration_offset: number;
  dataConfidence?: number;
}

export const Accuracy_calculatorInputSchema = z.object({
  true_value: z.number().default(100),
  measured_value: z.number().default(98),
  full_scale: z.number().default(200),
  tolerance_limit: z.number().default(2),
  calibration_offset: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Accuracy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.measured_value - input.calibration_offset - input.true_value; results["absolute_error"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["absolute_error"] = Number.NaN; }
  try { const v = ((input.measured_value - input.calibration_offset - input.true_value) / input.true_value) * 100; results["relative_error_percent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["relative_error_percent"] = Number.NaN; }
  return results;
}


export function calculateAccuracy_calculator(input: Accuracy_calculatorInput): Accuracy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["absolute_error"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Accuracy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
