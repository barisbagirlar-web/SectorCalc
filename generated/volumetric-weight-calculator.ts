// Auto-generated from volumetric-weight-calculator-schema.json
import * as z from 'zod';

export interface Volumetric_weight_calculatorInput {
  length_cm: number;
  width_cm: number;
  height_cm: number;
  actual_weight_kg: number;
  carrier_factor: string;
  package_type: string;
  is_stackable: boolean;
  hazardous_material: boolean;
}

export const Volumetric_weight_calculatorInputSchema = z.object({
  length_cm: z.number().min(0).max(500).default(0),
  width_cm: z.number().min(0).max(500).default(0),
  height_cm: z.number().min(0).max(500).default(0),
  actual_weight_kg: z.number().min(0).max(1000).default(0),
  carrier_factor: z.enum(['4000', '5000', '6000', '7000']).default('5000'),
  package_type: z.enum(['box', 'cylinder', 'pallet', 'irregular']).default('box'),
  is_stackable: z.boolean().default(true),
  hazardous_material: z.boolean().default(false),
});

function evaluateAllFormulas(input: Volumetric_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.package_type = 'cylinder') ? (PI() * (input.width_cm/2)^2 * input.length_cm) : (input.length_cm * input.width_cm * input.height_cm)); results["volume_cm3"] = Number.isFinite(v) ? v : 0; } catch { results["volume_cm3"] = 0; }
  try { const v = (results["volume_cm3"] ?? 0) / 1000000; results["volume_m3"] = Number.isFinite(v) ? v : 0; } catch { results["volume_m3"] = 0; }
  try { const v = (results["volume_cm3"] ?? 0) / input.carrier_factor; results["volumetric_weight_kg"] = Number.isFinite(v) ? v : 0; } catch { results["volumetric_weight_kg"] = 0; }
  try { const v = Math.max(input.actual_weight_kg, (results["volumetric_weight_kg"] ?? 0)); results["chargeable_weight_kg"] = Number.isFinite(v) ? v : 0; } catch { results["chargeable_weight_kg"] = 0; }
  try { const v = (results["volumetric_weight_kg"] ?? 0) / NULLIF(input.actual_weight_kg, 0); results["dim_weight_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["dim_weight_ratio"] = 0; }
  try { const v = input.actual_weight_kg / NULLIF((results["volume_m3"] ?? 0), 0); results["density_kg_m3"] = Number.isFinite(v) ? v : 0; } catch { results["density_kg_m3"] = 0; }
  results["cost_estimate_usd"] = 0;
  return results;
}


export function calculateVolumetric_weight_calculator(input: Volumetric_weight_calculatorInput): Volumetric_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["chargeable_weight_kg"] ?? 0;
  const breakdown = {
    volume_cm3: values["volume_cm3"] ?? 0,
    volume_m3: values["volume_m3"] ?? 0,
    actual_weight_kg: values["actual_weight_kg"] ?? 0,
    volumetric_weight_kg: values["volumetric_weight_kg"] ?? 0,
    dim_weight_ratio: values["dim_weight_ratio"] ?? 0,
    density_kg_m3: values["density_kg_m3"] ?? 0,
    cost_estimate_usd: values["cost_estimate_usd"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Void Fill","Non-Standard Packaging","Overpackaging","Carrier DIM Factor Mismatch"];
  const suggestedActions: string[] = ["Reduce package dimensions by 10% to lower volumetric weight. Consider custom box sizes.","Evaluate alternative carriers with higher DIM factors (e.g., 6000 vs 5000) for dense packages.","Redesign packaging to be stackable. Use uniform box sizes and reinforced corners.","Use adjustable packaging or void fill audit to reduce empty space below 20%.","Consolidate multiple items into one package to improve density and reduce per-unit cost."];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-currency cost comparison","Real-time carrier rate integration","Batch processing","Customizable alert thresholds"],
  };
}


export interface Volumetric_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: { volume_cm3: number; volume_m3: number; actual_weight_kg: number; volumetric_weight_kg: number; dim_weight_ratio: number; density_kg_m3: number; cost_estimate_usd: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
