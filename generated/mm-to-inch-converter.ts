// Auto-generated from mm-to-inch-converter-schema.json
import * as z from 'zod';

export interface Mm_to_inch_converterInput {
  value_mm: number;
  precision: string;
  tolerance_mm: number;
  unit_system: string;
  apply_six_sigma: boolean;
}

export const Mm_to_inch_converterInputSchema = z.object({
  value_mm: z.number().min(0).max(100000).default(0),
  precision: z.enum(['0', '1', '2', '3', '4', '5', '6']).default('4'),
  tolerance_mm: z.number().min(0).max(10).default(0.1),
  unit_system: z.enum(['imperial', 'metric']).default('imperial'),
  apply_six_sigma: z.boolean().default(false),
});

function evaluateAllFormulas(input: Mm_to_inch_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["raw_inches"] = input.value_mm / 25.4; } catch { results["raw_inches"] = 0; }
  try { results["rounded_inches"] = Math.round((results["raw_inches"] ?? 0), input.precision); } catch { results["rounded_inches"] = 0; }
  try { results["tolerance_inches"] = input.tolerance_mm / 25.4; } catch { results["tolerance_inches"] = 0; }
  try { results["upper_spec_limit"] = (results["rounded_inches"] ?? 0) + (results["tolerance_inches"] ?? 0); } catch { results["upper_spec_limit"] = 0; }
  try { results["lower_spec_limit"] = (results["rounded_inches"] ?? 0) - (results["tolerance_inches"] ?? 0); } catch { results["lower_spec_limit"] = 0; }
  try { results["six_sigma_adjusted"] = IF(input.apply_six_sigma, (results["rounded_inches"] ?? 0) + (0.001 * input.value_mm / 25.4), (results["rounded_inches"] ?? 0)); } catch { results["six_sigma_adjusted"] = 0; }
  try { results["primary_result"] = (results["six_sigma_adjusted"] ?? 0); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateMm_to_inch_converter(input: Mm_to_inch_converterInput): Mm_to_inch_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary_result"] ?? 0;
  const breakdown = {
    raw_inches: values["raw_inches"] ?? 0,
    rounded_inches: values["rounded_inches"] ?? 0,
    tolerance_inches: values["tolerance_inches"] ?? 0,
    upper_spec_limit: values["upper_spec_limit"] ?? 0,
    lower_spec_limit: values["lower_spec_limit"] ?? 0,
    six_sigma_adjusted: values["six_sigma_adjusted"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Rounding Loss","Tolerance Bandwidth","Six Sigma Shift Magnitude"];
  const suggestedActions: string[] = ["Review tolerance specification. Consider ISO 2768-m or tighter class for precision fits.","Increase decimal precision to at least 3 for better accuracy in manufacturing drawings.","Perform a process capability study (Cpk) to validate the Six Sigma shift assumption.","Use a micrometer with 0.001 mm resolution to ensure measurement accuracy per WERC guidelines."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Batch conversion","Custom precision rounding"],
  };
}


export interface Mm_to_inch_converterOutput {
  totalWasteCost: number;
  breakdown: { raw_inches: number; rounded_inches: number; tolerance_inches: number; upper_spec_limit: number; lower_spec_limit: number; six_sigma_adjusted: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
