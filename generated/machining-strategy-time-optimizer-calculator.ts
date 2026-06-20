// Auto-generated from machining-strategy-time-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Machining_strategy_time_optimizer_calculatorInput {
  cutting_speed: number;
  feed_rate: number;
  depth_of_cut: number;
  part_length: number;
  part_diameter: number;
  tool_change_time: number;
  tool_life_minutes: number;
  number_of_passes: number;
  dataConfidence?: number;
}

export const Machining_strategy_time_optimizer_calculatorInputSchema = z.object({
  cutting_speed: z.number().min(20).max(500).default(150),
  feed_rate: z.number().min(0.05).max(1).default(0.25),
  depth_of_cut: z.number().min(0.1).max(10).default(2),
  part_length: z.number().min(10).max(2000).default(200),
  part_diameter: z.number().min(5).max(500).default(50),
  tool_change_time: z.number().min(0.5).max(10).default(2),
  tool_life_minutes: z.number().min(5).max(120).default(30),
  number_of_passes: z.number().min(1).max(10).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Machining_strategy_time_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cutting_speed * (input.feed_rate / 100) * input.depth_of_cut * input.part_length; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.cutting_speed * (input.feed_rate / 100) * input.depth_of_cut * input.part_length * (input.part_diameter * input.tool_change_time * input.tool_life_minutes * input.number_of_passes); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.part_diameter * input.tool_change_time * input.tool_life_minutes * input.number_of_passes; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateMachining_strategy_time_optimizer_calculator(input: Machining_strategy_time_optimizer_calculatorInput): Machining_strategy_time_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-machine comparison","Custom KPI dashboards"],
  };
}


export interface Machining_strategy_time_optimizer_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Machining_strategy_time_optimizer_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

