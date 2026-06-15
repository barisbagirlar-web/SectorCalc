// Auto-generated from cutting-parameters-tool-life-schema.json
import * as z from 'zod';

export interface Cutting_parameters_tool_lifeInput {
  cutting_speed: number;
  feed_rate: number;
  depth_of_cut: number;
  tool_material: string;
  workpiece_material: string;
  coolant_used: boolean;
  machine_stability_factor: number;
}

export const Cutting_parameters_tool_lifeInputSchema = z.object({
  cutting_speed: z.number().min(10).max(500).default(150),
  feed_rate: z.number().min(0.05).max(1).default(0.2),
  depth_of_cut: z.number().min(0.1).max(10).default(2),
  tool_material: z.enum(['high_speed_steel', 'carbide', 'ceramic', 'cbn', 'diamond']).default('carbide'),
  workpiece_material: z.enum(['steel', 'stainless_steel', 'aluminum', 'titanium', 'cast_iron', 'superalloy']).default('steel'),
  coolant_used: z.boolean().default(true),
  machine_stability_factor: z.number().min(0.5).max(1.5).default(1),
});

function evaluateAllFormulas(input: Cutting_parameters_tool_lifeInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["base_tool_life"] = (C / (input.cutting_speed ^ n)) * (1 / (input.feed_rate ^ m)) * (1 / (input.depth_of_cut ^ p)); } catch { results["base_tool_life"] = 0; }
  try { results["material_adjustment"] = machinability_rating(input.workpiece_material); } catch { results["material_adjustment"] = 0; }
  try { results["tool_material_adjustment"] = tool_factor(input.tool_material); } catch { results["tool_material_adjustment"] = 0; }
  try { results["coolant_adjustment"] = input.coolant_used ? 1.3 : 1.0; } catch { results["coolant_adjustment"] = 0; }
  try { results["machine_stability_adjustment"] = input.machine_stability_factor; } catch { results["machine_stability_adjustment"] = 0; }
  try { results["adjusted_tool_life"] = T_base * K_material * K_tool * K_coolant * K_machine; } catch { results["adjusted_tool_life"] = 0; }
  try { results["primary_result"] = (Math.Math.round((T_adjusted) * 10**(2)) / 10**(2)); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateCutting_parameters_tool_life(input: Cutting_parameters_tool_lifeInput): Cutting_parameters_tool_lifeOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tool_life_minutes"] ?? 0;
  const breakdown = {
    base_tool_life: values["base_tool_life"] ?? 0,
    material_adjustment_factor: values["material_adjustment_factor"] ?? 0,
    tool_material_adjustment_factor: values["tool_material_adjustment_factor"] ?? 0,
    coolant_adjustment_factor: values["coolant_adjustment_factor"] ?? 0,
    machine_stability_adjustment_factor: values["machine_stability_adjustment_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Vibration-Induced Wear","Thermal Cracking Risk","Built-Up Edge Formation","Tool Micro-Chipping"];
  const suggestedActions: string[] = ["Reduce Cutting Speed","Optimize Feed Rate","Apply Coolant","Check Machine Stability","Use Stronger Tool Material"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-machine comparison","Custom material database"],
  };
}


export interface Cutting_parameters_tool_lifeOutput {
  totalWasteCost: number;
  breakdown: { base_tool_life: number; material_adjustment_factor: number; tool_material_adjustment_factor: number; coolant_adjustment_factor: number; machine_stability_adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
