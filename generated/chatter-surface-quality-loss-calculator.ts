// Auto-generated from chatter-surface-quality-loss-calculator-schema.json
import * as z from 'zod';

export interface Chatter_surface_quality_loss_calculatorInput {
  cutting_speed: number;
  feed_rate: number;
  depth_of_cut: number;
  tool_overhang: number;
  tool_diameter: number;
  workpiece_material_hardness: string;
  machine_spindle_power: number;
  machine_damping_ratio: number;
  tool_material: string;
  coolant_application: boolean;
}

export const Chatter_surface_quality_loss_calculatorInputSchema = z.object({
  cutting_speed: z.number().min(20).max(500).default(150),
  feed_rate: z.number().min(0.02).max(0.8).default(0.15),
  depth_of_cut: z.number().min(0.1).max(10).default(2),
  tool_overhang: z.number().min(20).max(200).default(80),
  tool_diameter: z.number().min(5).max(100).default(20),
  workpiece_material_hardness: z.enum(['150', '200', '300', '450']).default('200'),
  machine_spindle_power: z.number().min(2).max(100).default(15),
  machine_damping_ratio: z.number().min(0.01).max(0.2).default(0.05),
  tool_material: z.enum(['hss', 'carbide', 'ceramic', 'cbn']).default('carbide'),
  coolant_application: z.boolean().default(true),
});

function evaluateAllFormulas(input: Chatter_surface_quality_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cutting_speed * input.feed_rate * input.depth_of_cut) / (input.tool_diameter**2 * input.machine_damping_ratio * (1 + 0.1 * (input.tool_overhang / input.tool_diameter - 2))); results["chatter_index"] = Number.isFinite(v) ? v : 0; } catch { results["chatter_index"] = 0; }
  try { const v = (input.feed_rate**2) / (32 * 0.8); results["surface_roughness_target"] = Number.isFinite(v) ? v : 0; } catch { results["surface_roughness_target"] = 0; }
  try { const v = (results["surface_roughness_target"] ?? 0) * (1 + 2 * (results["chatter_index"] ?? 0)); results["surface_roughness_actual"] = Number.isFinite(v) ? v : 0; } catch { results["surface_roughness_actual"] = 0; }
  try { const v = (input.workpiece_material_hardness / 200)**0.5; results["material_hardness_factor"] = Number.isFinite(v) ? v : 0; } catch { results["material_hardness_factor"] = 0; }
  try { const v = (input.tool_material === 'hss' ? 1.2 : (input.tool_material === 'carbide' ? 1.0 : (input.tool_material === 'ceramic' ? 0.8 : (input.tool_material === 'cbn' ? 0.6 : 1.0)))); results["tool_material_factor"] = Number.isFinite(v) ? v : 0; } catch { results["tool_material_factor"] = 0; }
  try { const v = ((input.coolant_application) ? (0.9) : (1.0)); results["coolant_factor"] = Number.isFinite(v) ? v : 0; } catch { results["coolant_factor"] = 0; }
  try { const v = 100 * (1 - Math.exp(-0.5 * (results["chatter_index"] ?? 0) * (results["material_hardness_factor"] ?? 0) * (results["tool_material_factor"] ?? 0) * (results["coolant_factor"] ?? 0))); results["total_quality_loss_percentage"] = Number.isFinite(v) ? v : 0; } catch { results["total_quality_loss_percentage"] = 0; }
  return results;
}


export function calculateChatter_surface_quality_loss_calculator(input: Chatter_surface_quality_loss_calculatorInput): Chatter_surface_quality_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_quality_loss_percentage"] ?? 0;
  const breakdown = {
    chatter_index: values["chatter_index"] ?? 0,
    surface_roughness_target: values["surface_roughness_target"] ?? 0,
    surface_roughness_actual: values["surface_roughness_actual"] ?? 0,
    material_hardness_factor: values["material_hardness_factor"] ?? 0,
    tool_material_factor: values["tool_material_factor"] ?? 0,
    coolant_factor: values["coolant_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Dynamic Compliance","Process Damping","Regenerative Effect"];
  const suggestedActions: string[] = ["Reduce tool overhang to below 3x diameter","Increase machine damping (tune dampers or use tuned mass damper)","Adjust cutting speed to avoid resonant spindle speeds","Ensure flood coolant is applied to reduce thermal softening and friction","Use CBN or ceramic tool for harder materials"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time monitoring","Multi-machine comparison"],
  };
}


export interface Chatter_surface_quality_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: { chatter_index: number; surface_roughness_target: number; surface_roughness_actual: number; material_hardness_factor: number; tool_material_factor: number; coolant_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
