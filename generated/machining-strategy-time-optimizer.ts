// Auto-generated from machining-strategy-time-optimizer-schema.json
import * as z from 'zod';

export interface Machining_strategy_time_optimizerInput {
  cutting_speed: number;
  feed_rate: number;
  depth_of_cut: number;
  part_length: number;
  part_diameter: number;
  tool_change_time: number;
  tool_life_minutes: number;
  number_of_passes: number;
  machine_type: string;
  use_high_feed: boolean;
}

export const Machining_strategy_time_optimizerInputSchema = z.object({
  cutting_speed: z.number().min(20).max(500).default(150),
  feed_rate: z.number().min(0.05).max(1).default(0.25),
  depth_of_cut: z.number().min(0.1).max(10).default(2),
  part_length: z.number().min(10).max(2000).default(200),
  part_diameter: z.number().min(5).max(500).default(50),
  tool_change_time: z.number().min(0.5).max(10).default(2),
  tool_life_minutes: z.number().min(5).max(120).default(30),
  number_of_passes: z.number().min(1).max(10).default(1),
  machine_type: z.enum(['CNC Lathe', 'CNC Mill', 'Multi-Axis']).default('CNC Lathe'),
  use_high_feed: z.boolean().default(false),
});

function evaluateAllFormulas(input: Machining_strategy_time_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cutting_speed * 1000) / (Math.PI * input.part_diameter); results["spindle_speed"] = Number.isFinite(v) ? v : 0; } catch { results["spindle_speed"] = 0; }
  try { const v = input.part_length / (input.feed_rate * (results["spindle_speed"] ?? 0)); results["cutting_time_per_pass"] = Number.isFinite(v) ? v : 0; } catch { results["cutting_time_per_pass"] = 0; }
  try { const v = (results["cutting_time_per_pass"] ?? 0) * input.number_of_passes; results["total_cutting_time"] = Number.isFinite(v) ? v : 0; } catch { results["total_cutting_time"] = 0; }
  try { const v = (results["total_cutting_time"] ?? 0) / input.tool_life_minutes; results["tool_change_frequency"] = Number.isFinite(v) ? v : 0; } catch { results["tool_change_frequency"] = 0; }
  try { const v = (results["tool_change_frequency"] ?? 0) * input.tool_change_time; results["tool_change_downtime"] = Number.isFinite(v) ? v : 0; } catch { results["tool_change_downtime"] = 0; }
  try { const v = input.use_high_feed ? 0.85 : 1.0; results["high_feed_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["high_feed_adjustment"] = 0; }
  try { const v = ((results["total_cutting_time"] ?? 0) + (results["tool_change_downtime"] ?? 0)) * (results["high_feed_adjustment"] ?? 0); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  try { const v = (results["total_cutting_time"] ?? 0); results["cutting_time"] = Number.isFinite(v) ? v : 0; } catch { results["cutting_time"] = 0; }
  try { const v = (results["primary_result"] ?? 0); results["optimized_cycle_time"] = Number.isFinite(v) ? v : 0; } catch { results["optimized_cycle_time"] = 0; }
  return results;
}


export function calculateMachining_strategy_time_optimizer(input: Machining_strategy_time_optimizerInput): Machining_strategy_time_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["optimized_cycle_time"] ?? 0;
  const breakdown = {
    cutting_time: values["cutting_time"] ?? 0,
    tool_change_downtime: values["tool_change_downtime"] ?? 0,
    spindle_speed: values["spindle_speed"] ?? 0,
    tool_change_frequency: values["tool_change_frequency"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Tool Changes","Low Spindle Utilization","Non-Optimal Feed Rate"];
  const suggestedActions: string[] = ["Increase Feed Rate","Enable High Feed Strategy","Optimize Tool Life","Reduce Number of Passes"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-machine comparison","Custom KPI dashboards"],
  };
}


export interface Machining_strategy_time_optimizerOutput {
  totalWasteCost: number;
  breakdown: { cutting_time: number; tool_change_downtime: number; spindle_speed: number; tool_change_frequency: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
