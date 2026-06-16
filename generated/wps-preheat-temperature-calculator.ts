// Auto-generated from wps-preheat-temperature-calculator-schema.json
import * as z from 'zod';

export interface Wps_preheat_temperature_calculatorInput {
  material_thickness: number;
  carbon_equivalent: number;
  hydrogen_level: string;
  heat_input: number;
  joint_restraint: string;
  preheat_method: string;
}

export const Wps_preheat_temperature_calculatorInputSchema = z.object({
  material_thickness: z.number().min(1).max(300).default(25),
  carbon_equivalent: z.number().min(0.1).max(1.2).default(0.45),
  hydrogen_level: z.enum(['low', 'medium', 'high']).default('medium'),
  heat_input: z.number().min(0.5).max(5).default(1.5),
  joint_restraint: z.enum(['low', 'moderate', 'high']).default('moderate'),
  preheat_method: z.enum(['electric', 'gas', 'induction']).default('electric'),
});

function evaluateAllFormulas(input: Wps_preheat_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.carbon_equivalent <= 0.35) ? (0) : (((input.carbon_equivalent <= 0.55) ? ((input.carbon_equivalent - 0.35) * 200) : ((input.carbon_equivalent - 0.35) * 250)))); results["carbon_equivalent_factor"] = Number.isFinite(v) ? v : 0; } catch { results["carbon_equivalent_factor"] = 0; }
  try { const v = ((input.material_thickness <= 25) ? (input.material_thickness * 1.5) : (25 * 1.5 + (input.material_thickness - 25) * 1.2)); results["thickness_factor"] = Number.isFinite(v) ? v : 0; } catch { results["thickness_factor"] = 0; }
  results["hydrogen_factor"] = 0;
  try { const v = ((input.heat_input < 1.0) ? ((1.0 - input.heat_input) * 80) : (((input.heat_input <= 2.5) ? (0) : ((input.heat_input - 2.5) * -20)))); results["heat_input_factor"] = Number.isFinite(v) ? v : 0; } catch { results["heat_input_factor"] = 0; }
  results["restraint_factor"] = 0;
  try { const v = (results["carbon_equivalent_factor"] ?? 0) + (results["thickness_factor"] ?? 0) + (results["hydrogen_factor"] ?? 0) + (results["heat_input_factor"] ?? 0) + (results["restraint_factor"] ?? 0); results["preheat_temperature_raw"] = Number.isFinite(v) ? v : 0; } catch { results["preheat_temperature_raw"] = 0; }
  results["primaryResult"] = 0;
  return results;
}


export function calculateWps_preheat_temperature_calculator(input: Wps_preheat_temperature_calculatorInput): Wps_preheat_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["preheat_temperature"] ?? 0;
  const breakdown = {
    carbon_equivalent_factor: values["carbon_equivalent_factor"] ?? 0,
    thickness_factor: values["thickness_factor"] ?? 0,
    hydrogen_factor: values["hydrogen_factor"] ?? 0,
    heat_input_factor: values["heat_input_factor"] ?? 0,
    restraint_factor: values["restraint_factor"] ?? 0,
    method_efficiency: values["method_efficiency"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Moisture Risk","Thermal Stress","Energy Cost Impact"];
  const suggestedActions: string[] = ["Verify Carbon Equivalent","Check Consumable Hydrogen","Optimize Heat Input","Monitor Preheat Uniformity"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-user collaboration","Custom material database"],
  };
}


export interface Wps_preheat_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: { carbon_equivalent_factor: number; thickness_factor: number; hydrogen_factor: number; heat_input_factor: number; restraint_factor: number; method_efficiency: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
