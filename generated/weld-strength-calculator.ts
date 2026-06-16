// Auto-generated from weld-strength-calculator-schema.json
import * as z from 'zod';

export interface Weld_strength_calculatorInput {
  weld_type: string;
  base_material_yield_strength: number;
  weld_material_tensile_strength: number;
  throat_thickness: number;
  weld_length: number;
  applied_load: number;
  load_angle: number;
  quality_level: string;
  inspection_method: string;
  is_fatigue_loading: boolean;
}

export const Weld_strength_calculatorInputSchema = z.object({
  weld_type: z.enum(['fillet', 'groove', 'plug', 'slot', 'butt']).default('fillet'),
  base_material_yield_strength: z.number().min(100).max(1200).default(345),
  weld_material_tensile_strength: z.number().min(200).max(1500).default(480),
  throat_thickness: z.number().min(1).max(50).default(6),
  weld_length: z.number().min(10).max(5000).default(100),
  applied_load: z.number().min(0.1).max(2000).default(50),
  load_angle: z.number().min(0).max(180).default(90),
  quality_level: z.enum(['B', 'C', 'D']).default('B'),
  inspection_method: z.enum(['visual', 'ultrasonic', 'radiographic', 'magnetic_particle']).default('visual'),
  is_fatigue_loading: z.boolean().default(false),
});

function evaluateAllFormulas(input: Weld_strength_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["effective_area"] = input.throat_thickness * input.weld_length; } catch { results["effective_area"] = 0; }
  results["stress_distribution_factor"] = 0;
  results["allowable_stress"] = 0;
  try { results["load_component_transverse"] = input.applied_load * SIN(input.load_angle * Math.PI() / 180); } catch { results["load_component_transverse"] = 0; }
  try { results["load_component_longitudinal"] = input.applied_load * COS(input.load_angle * Math.PI() / 180); } catch { results["load_component_longitudinal"] = 0; }
  results["fatigue_reduction_factor"] = 0;
  try { results["weld_strength_capacity"] = (results["effective_area"] ?? 0) * (results["allowable_stress"] ?? 0) * (results["stress_distribution_factor"] ?? 0) * (results["fatigue_reduction_factor"] ?? 0) / 1000; } catch { results["weld_strength_capacity"] = 0; }
  return results;
}


export function calculateWeld_strength_calculator(input: Weld_strength_calculatorInput): Weld_strength_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["safety_margin"] ?? 0;
  const breakdown = {
    effective_area: values["effective_area"] ?? 0,
    allowable_stress: values["allowable_stress"] ?? 0,
    stress_distribution_factor: values["stress_distribution_factor"] ?? 0,
    fatigue_reduction_factor: values["fatigue_reduction_factor"] ?? 0,
    weld_strength_capacity: values["weld_strength_capacity"] ?? 0,
    transverse_load_component: values["transverse_load_component"] ?? 0,
    longitudinal_load_component: values["longitudinal_load_component"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Undermatching Penalty","Quality Level Derating","Inspection Method Uncertainty"];
  const suggestedActions: string[] = ["Increase throat thickness by 20% or use larger weld size.","Implement ISO 5817 Level B inspection and process control.","Redesign joint to reduce load by 30% or add reinforcement.","Select filler with tensile strength ≥ 1.2x base material yield."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-material database","Fatigue life prediction","Weld procedure specification (WPS) generator"],
  };
}


export interface Weld_strength_calculatorOutput {
  totalWasteCost: number;
  breakdown: { effective_area: number; allowable_stress: number; stress_distribution_factor: number; fatigue_reduction_factor: number; weld_strength_capacity: number; transverse_load_component: number; longitudinal_load_component: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
