// Auto-generated from cnc-cycle-time-calculator-schema.json
import * as z from 'zod';

export interface Cnc_cycle_time_calculatorInput {
  cutting_length: number;
  feed_rate: number;
  spindle_speed: number;
  number_of_passes: number;
  rapid_traverse_distance: number;
  rapid_traverse_rate: number;
  tool_change_time: number;
  number_of_tool_changes: number;
  material_hardness_factor: string;
  tool_wear_factor: number;
  machine_efficiency: number;
  part_loading_time: number;
  coolant_on_time: number;
  measurement_time: number;
}

export const Cnc_cycle_time_calculatorInputSchema = z.object({
  cutting_length: z.number().min(0.1).max(10000).default(100),
  feed_rate: z.number().min(1).max(10000).default(500),
  spindle_speed: z.number().min(100).max(30000).default(3000),
  number_of_passes: z.number().min(1).max(100).default(1),
  rapid_traverse_distance: z.number().min(0).max(5000).default(50),
  rapid_traverse_rate: z.number().min(1000).max(60000).default(15000),
  tool_change_time: z.number().min(0.5).max(120).default(5),
  number_of_tool_changes: z.number().min(0).max(50).default(2),
  material_hardness_factor: z.enum(['soft', 'medium', 'hard', 'exotic']).default('medium'),
  tool_wear_factor: z.number().min(0.8).max(2).default(1),
  machine_efficiency: z.number().min(50).max(100).default(85),
  part_loading_time: z.number().min(1).max(300).default(10),
  coolant_on_time: z.number().min(0).max(60).default(2),
  measurement_time: z.number().min(0).max(300).default(0),
});

function evaluateAllFormulas(input: Cnc_cycle_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cutting_length / input.feed_rate) * input.number_of_passes * input.material_hardness_factor * input.tool_wear_factor; results["cutting_time"] = Number.isFinite(v) ? v : 0; } catch { results["cutting_time"] = 0; }
  try { const v = input.rapid_traverse_distance / input.rapid_traverse_rate; results["rapid_traverse_time"] = Number.isFinite(v) ? v : 0; } catch { results["rapid_traverse_time"] = 0; }
  try { const v = input.tool_change_time * input.number_of_tool_changes / 60; results["tool_change_total_time"] = Number.isFinite(v) ? v : 0; } catch { results["tool_change_total_time"] = 0; }
  try { const v = (input.part_loading_time + input.coolant_on_time + input.measurement_time) / 60; results["auxiliary_time"] = Number.isFinite(v) ? v : 0; } catch { results["auxiliary_time"] = 0; }
  try { const v = (results["cutting_time"] ?? 0) + (results["rapid_traverse_time"] ?? 0) + (results["tool_change_total_time"] ?? 0) + (results["auxiliary_time"] ?? 0); results["raw_cycle_time"] = Number.isFinite(v) ? v : 0; } catch { results["raw_cycle_time"] = 0; }
  try { const v = 100 / input.machine_efficiency; results["efficiency_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency_adjustment"] = 0; }
  try { const v = (results["raw_cycle_time"] ?? 0) * (results["efficiency_adjustment"] ?? 0); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateCnc_cycle_time_calculator(input: Cnc_cycle_time_calculatorInput): Cnc_cycle_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cycle_time"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    cutting_time: values["cutting_time"] ?? 0,
    rapid_traverse_time: values["rapid_traverse_time"] ?? 0,
    tool_change_time: values["tool_change_time"] ?? 0,
    auxiliary_time: values["auxiliary_time"] ?? 0,
    efficiency_loss: values["efficiency_loss"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Non-Cutting Overhead","Tool Wear Impact","Material Hardness Impact","Efficiency Loss"];
  const suggestedActions: string[] = ["Optimize Tool Path","Combine Operations","Increase Feed Rate","Improve OEE","Use Premium Tooling"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-machine comparison","Custom report builder","API access"],
  };
}


export interface Cnc_cycle_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: { cutting_time: number; rapid_traverse_time: number; tool_change_time: number; auxiliary_time: number; efficiency_loss: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
