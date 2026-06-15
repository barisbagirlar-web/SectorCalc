// Auto-generated from kg-to-lb-converter-schema.json
import * as z from 'zod';

export interface Kg_to_lb_converterInput {
  mass_kg: number;
  precision_level: string;
  use_industry_rounding: boolean;
  measurement_uncertainty: number;
}

export const Kg_to_lb_converterInputSchema = z.object({
  mass_kg: z.number().min(0).max(1000000).default(0),
  precision_level: z.enum(['0', '1', '2', '3', '4', '5', '6']).default('2'),
  use_industry_rounding: z.boolean().default(true),
  measurement_uncertainty: z.number().min(0).max(10).default(0.5),
});

function evaluateAllFormulas(input: Kg_to_lb_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["raw_conversion"] = input.mass_kg * 2.20462262185; } catch { results["raw_conversion"] = 0; }
  results["rounding_application"] = 0;
  try { results["uncertainty_adjustment"] = rounded_lb * (input.measurement_uncertainty / 100) * 2; } catch { results["uncertainty_adjustment"] = 0; }
  try { results["confidence_interval_lower"] = rounded_lb - uncertainty_lb; } catch { results["confidence_interval_lower"] = 0; }
  try { results["confidence_interval_upper"] = rounded_lb + uncertainty_lb; } catch { results["confidence_interval_upper"] = 0; }
  try { results["data_confidence_score"] = Math.max(0, 1 - (input.measurement_uncertainty / 10)); } catch { results["data_confidence_score"] = 0; }
  try { results["primary_result"] = rounded_lb * (1 - (input.measurement_uncertainty / 100)); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateKg_to_lb_converter(input: Kg_to_lb_converterInput): Kg_to_lb_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary_lb"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    description: values["description"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Rounding Loss","Uncertainty Loss","Non-Compliance Risk"];
  const suggestedActions: string[] = ["Verify Input Mass","Reduce Measurement Uncertainty","Enable Industry Rounding","Export Full Report"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Kg_to_lb_converterOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; description: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
