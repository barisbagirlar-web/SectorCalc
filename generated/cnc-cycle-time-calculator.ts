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
  dataConfidence?: number;
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
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cnc_cycle_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cutting_length * (input.feed_rate / 100) * input.spindle_speed * input.number_of_passes; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.cutting_length * (input.feed_rate / 100) * input.spindle_speed * input.number_of_passes * (input.rapid_traverse_distance * (input.rapid_traverse_rate / 100) * input.tool_change_time * input.number_of_tool_changes); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.rapid_traverse_distance * (input.rapid_traverse_rate / 100) * input.tool_change_time * input.number_of_tool_changes; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCnc_cycle_time_calculator(input: Cnc_cycle_time_calculatorInput): Cnc_cycle_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-machine comparison","Custom report builder","API access"],
  };
}


export interface Cnc_cycle_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
