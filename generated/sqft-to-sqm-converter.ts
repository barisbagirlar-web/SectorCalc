// Auto-generated from sqft-to-sqm-converter-schema.json
import * as z from 'zod';

export interface Sqft_to_sqm_converterInput {
  area_sqft: number;
  measurement_accuracy: string;
  rounding_precision: string;
  include_tolerance: boolean;
}

export const Sqft_to_sqm_converterInputSchema = z.object({
  area_sqft: z.number().min(0.001).max(1000000).default(100),
  measurement_accuracy: z.enum(['high', 'standard', 'low']).default('standard'),
  rounding_precision: z.enum(['0', '1', '2', '3', '4']).default('2'),
  include_tolerance: z.boolean().default(false),
});

function evaluateAllFormulas(input: Sqft_to_sqm_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area_sqft * 0.09290304; results["raw_conversion"] = Number.isFinite(v) ? v : 0; } catch { results["raw_conversion"] = 0; }
  try { const v = (input.measurement_accuracy === 'high' ? 1.0 : (input.measurement_accuracy === 'standard' ? 0.95 : (input.measurement_accuracy === 'low' ? 0.85 : 0))); results["accuracy_factor"] = Number.isFinite(v) ? v : 0; } catch { results["accuracy_factor"] = 0; }
  results["tolerance_calculation"] = 0;
  results["rounded_conversion"] = 0;
  try { const v = (results["accuracy_factor"] ?? 0) * (1 - (input.area_sqft / 1000000) * 0.1); results["confidence_score"] = Number.isFinite(v) ? v : 0; } catch { results["confidence_score"] = 0; }
  results["hidden_loss_drivers"] = 0;
  results["suggested_actions"] = 0;
  return results;
}


export function calculateSqft_to_sqm_converter(input: Sqft_to_sqm_converterInput): Sqft_to_sqm_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["area_sqm"] ?? 0;
  const breakdown = {
    raw_conversion: values["raw_conversion"] ?? 0,
    accuracy_factor: values["accuracy_factor"] ?? 0,
    tolerance: values["tolerance"] ?? 0,
    rounded_value: values["rounded_value"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Measurement Error Risk","Cumulative Rounding Error Risk","No Tolerance Band Considered"];
  const suggestedActions: string[] = ["Re-measure with calibrated device","Verify large area by zones","Enable tolerance band"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Batch conversion","Custom rounding rules"],
  };
}


export interface Sqft_to_sqm_converterOutput {
  totalWasteCost: number;
  breakdown: { raw_conversion: number; accuracy_factor: number; tolerance: number; rounded_value: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
