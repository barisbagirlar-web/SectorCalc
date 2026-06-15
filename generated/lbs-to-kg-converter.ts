// Auto-generated from lbs-to-kg-converter-schema.json
import * as z from 'zod';

export interface Lbs_to_kg_converterInput {
  mass_lbs: number;
  precision_level: string;
  rounding_method: string;
  include_loss_analysis: boolean;
  measurement_uncertainty_pct: number;
  material_type: string;
}

export const Lbs_to_kg_converterInputSchema = z.object({
  mass_lbs: z.number().min(0).max(1000000).default(0),
  precision_level: z.enum(['0', '1', '2', '3', '4', '5', '6']).default('2'),
  rounding_method: z.enum(['standard', 'floor', 'ceiling', 'truncate']).default('standard'),
  include_loss_analysis: z.boolean().default(false),
  measurement_uncertainty_pct: z.number().min(0).max(10).default(0.5),
  material_type: z.enum(['general', 'hygroscopic', 'liquid', 'powder', 'metal']).default('general'),
});

function evaluateAllFormulas(input: Lbs_to_kg_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["base_conversion"] = input.mass_lbs * 0.45359237; } catch { results["base_conversion"] = 0; }
  try { results["rounding_application"] = Math.round(kg_base, input.precision_level, input.rounding_method); } catch { results["rounding_application"] = 0; }
  try { results["uncertainty_calculation"] = kg_base * (input.measurement_uncertainty_pct / 100); } catch { results["uncertainty_calculation"] = 0; }
  results["hidden_loss_factor"] = 0;
  try { results["hidden_loss_mass"] = kg_base * loss_factor; } catch { results["hidden_loss_mass"] = 0; }
  try { results["adjusted_mass"] = kg_rounded - (input.include_loss_analysis ? loss_kg : 0); } catch { results["adjusted_mass"] = 0; }
  try { results["data_confidence_score"] = Math.max(0, 1 - (input.measurement_uncertainty_pct / 100) - (input.include_loss_analysis ? loss_factor : 0)); } catch { results["data_confidence_score"] = 0; }
  return results;
}


export function calculateLbs_to_kg_converter(input: Lbs_to_kg_converterInput): Lbs_to_kg_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["kg_result"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    description: values["description"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Moisture Absorption","Spillage / Dust Loss","Evaporation Loss","Measurement Bias / Calibration Drift"];
  const suggestedActions: string[] = ["Recalibrate Scale","Use Desiccant or Climate Control","Improve Material Handling Procedures","Verify Scale Capacity","Use Higher Precision Instrument"];
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


export interface Lbs_to_kg_converterOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; description: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
