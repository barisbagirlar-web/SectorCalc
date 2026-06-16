// Auto-generated from container-load-calculator-schema.json
import * as z from 'zod';

export interface Container_load_calculatorInput {
  container_type: string;
  cargo_length_cm: number;
  cargo_width_cm: number;
  cargo_height_cm: number;
  cargo_weight_kg: number;
  stacking_factor: number;
  load_secure_method: string;
  use_pallet: boolean;
  pallet_height_cm: number;
}

export const Container_load_calculatorInputSchema = z.object({
  container_type: z.enum(['20ft_standard', '40ft_standard', '40ft_highcube', '20ft_open_top']).default('20ft_standard'),
  cargo_length_cm: z.number().min(10).max(1200).default(120),
  cargo_width_cm: z.number().min(10).max(240).default(100),
  cargo_height_cm: z.number().min(10).max(270).default(150),
  cargo_weight_kg: z.number().min(1).max(28000).default(500),
  stacking_factor: z.number().min(1).max(5).default(1),
  load_secure_method: z.enum(['blocking', 'lashing', 'shrink_wrap']).default('blocking'),
  use_pallet: z.boolean().default(true),
  pallet_height_cm: z.number().min(0).max(30).default(15),
});

function evaluateAllFormulas(input: Container_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.container_type === '20ft_standard' ? {length: 589.8, width: 235.2, height: 239.2, max_gross_kg: 24000} : (input.container_type === '40ft_standard' ? {length: 1203.2, width: 235.2, height: 239.2, max_gross_kg: 30480} : (input.container_type === '40ft_highcube' ? {length: 1203.2, width: 235.2, height: 269.2, max_gross_kg: 30480} : (input.container_type === '20ft_open_top' ? {length: 589.8, width: 235.2, height: 233.0, max_gross_kg: 24000} : 0)))); results["container_internal_dimensions"] = Number.isFinite(v) ? v : 0; } catch { results["container_internal_dimensions"] = 0; }
  try { const v = input.cargo_height_cm + (input.use_pallet ? input.pallet_height_cm : 0); results["total_unit_height"] = Number.isFinite(v) ? v : 0; } catch { results["total_unit_height"] = 0; }
  try { const v = Math.floor(((results["container_internal_dimensions"] ?? 0).length / input.cargo_length_cm) * ((results["container_internal_dimensions"] ?? 0).width / input.cargo_width_cm) * 0.85); results["units_per_layer"] = Number.isFinite(v) ? v : 0; } catch { results["units_per_layer"] = 0; }
  try { const v = Math.min(input.stacking_factor, Math.floor((results["container_internal_dimensions"] ?? 0).height / (results["total_unit_height"] ?? 0))); results["total_layers"] = Number.isFinite(v) ? v : 0; } catch { results["total_layers"] = 0; }
  try { const v = (results["units_per_layer"] ?? 0) * (results["total_layers"] ?? 0); results["total_units"] = Number.isFinite(v) ? v : 0; } catch { results["total_units"] = 0; }
  try { const v = ((results["total_units"] ?? 0) * input.cargo_length_cm * input.cargo_width_cm * (results["total_unit_height"] ?? 0)) / ((results["container_internal_dimensions"] ?? 0).length * (results["container_internal_dimensions"] ?? 0).width * (results["container_internal_dimensions"] ?? 0).height); results["volume_utilization"] = Number.isFinite(v) ? v : 0; } catch { results["volume_utilization"] = 0; }
  try { const v = ((results["total_units"] ?? 0) * input.cargo_weight_kg) / (results["container_internal_dimensions"] ?? 0).max_gross_kg; results["weight_utilization"] = Number.isFinite(v) ? v : 0; } catch { results["weight_utilization"] = 0; }
  return results;
}


export function calculateContainer_load_calculator(input: Container_load_calculatorInput): Container_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_units"] ?? 0;
  const breakdown = {
    container_type: values["container_type"] ?? 0,
    container_internal_volume_m3: values["container_internal_volume_m3"] ?? 0,
    cargo_volume_m3: values["cargo_volume_m3"] ?? 0,
    volume_utilization: values["volume_utilization"] ?? 0,
    weight_utilization: values["weight_utilization"] ?? 0,
    total_weight_kg: values["total_weight_kg"] ?? 0,
    void_space_percentage: values["void_space_percentage"] ?? 0,
    units_per_layer: values["units_per_layer"] ?? 0,
    total_layers: values["total_layers"] ?? 0,
    stacking_efficiency: values["stacking_efficiency"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unused volume due to dimensional mismatch or stacking constraints.","Unused weight capacity due to volume-limited loading.","Loss from inability to fully utilize stacking factor due to height constraints."];
  const suggestedActions: string[] = ["Consider using half-pallets or removing pallets to increase unit count.","Increase stacking factor if cargo crush resistance allows.","Switch to a 40 ft High Cube if height is the limiting factor.","Use mixed cargo sizes to fill void spaces (Lean: reduce muda)."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-container optimization","Real-time carrier rate integration","3D load visualization"],
  };
}


export interface Container_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: { container_type: number; container_internal_volume_m3: number; cargo_volume_m3: number; volume_utilization: number; weight_utilization: number; total_weight_kg: number; void_space_percentage: number; units_per_layer: number; total_layers: number; stacking_efficiency: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
