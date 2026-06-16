// Auto-generated from pressure-vessel-thickness-schema.json
import * as z from 'zod';

export interface Pressure_vessel_thicknessInput {
  design_pressure: number;
  vessel_diameter: number;
  allowable_stress: number;
  joint_efficiency: string;
  corrosion_allowance: number;
  material_utilization: number;
  safety_factor_override: boolean;
  custom_safety_factor: number;
}

export const Pressure_vessel_thicknessInputSchema = z.object({
  design_pressure: z.number().min(0.1).max(50).default(1),
  vessel_diameter: z.number().min(100).max(10000).default(1000),
  allowable_stress: z.number().min(50).max(500).default(138),
  joint_efficiency: z.enum(['1', '0.85', '0.7']).default('1'),
  corrosion_allowance: z.number().min(0).max(25).default(3),
  material_utilization: z.number().min(50).max(100).default(85),
  safety_factor_override: z.boolean().default(false),
  custom_safety_factor: z.number().min(2).max(6).default(3.5),
});

function evaluateAllFormulas(input: Pressure_vessel_thicknessInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.safety_factor_override) ? (input.custom_safety_factor) : (3.5)); results["safety_factor"] = Number.isFinite(v) ? v : 0; } catch { results["safety_factor"] = 0; }
  try { const v = (input.design_pressure * input.vessel_diameter) / (2 * input.allowable_stress * input.joint_efficiency - 1.2 * input.design_pressure); results["required_thickness_cylindrical"] = Number.isFinite(v) ? v : 0; } catch { results["required_thickness_cylindrical"] = 0; }
  try { const v = (results["required_thickness_cylindrical"] ?? 0) + input.corrosion_allowance; results["thickness_with_corrosion"] = Number.isFinite(v) ? v : 0; } catch { results["thickness_with_corrosion"] = 0; }
  try { const v = Math.PI * ((input.vessel_diameter/2 + (results["thickness_with_corrosion"] ?? 0))**2 - (input.vessel_diameter/2)**2) * 1000; results["material_volume"] = Number.isFinite(v) ? v : 0; } catch { results["material_volume"] = 0; }
  try { const v = ((results["material_volume"] ?? 0) / 1e9) * 7800 * 2.5 * (100 / input.material_utilization); results["material_cost"] = Number.isFinite(v) ? v : 0; } catch { results["material_cost"] = 0; }
  try { const v = ((results["material_volume"] ?? 0) / 1e9) * 7800; results["weight_per_meter"] = Number.isFinite(v) ? v : 0; } catch { results["weight_per_meter"] = 0; }
  try { const v = Math.ceil((results["thickness_with_corrosion"] ?? 0) * 2) / 2; results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculatePressure_vessel_thickness(input: Pressure_vessel_thicknessInput): Pressure_vessel_thicknessOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommended_thickness"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    required_thickness: values["required_thickness"] ?? 0,
    thickness_with_corrosion: values["thickness_with_corrosion"] ?? 0,
    material_volume_per_m: values["material_volume_per_m"] ?? 0,
    weight_per_meter: values["weight_per_meter"] ?? 0,
    material_cost_per_meter: values["material_cost_per_meter"] ?? 0,
    effective_safety_factor: values["effective_safety_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Corrosion Allowance","Low Joint Efficiency","Material Utilization Waste"];
  const suggestedActions: string[] = ["Consider Full Radiography","Review Corrosion Allowance","Improve Nesting Efficiency","Evaluate Higher Strength Material"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Material database sync","Multi-user collaboration","API access"],
  };
}


export interface Pressure_vessel_thicknessOutput {
  totalWasteCost: number;
  breakdown: { required_thickness: number; thickness_with_corrosion: number; material_volume_per_m: number; weight_per_meter: number; material_cost_per_meter: number; effective_safety_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
