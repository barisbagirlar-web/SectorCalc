// Auto-generated from cutting-parameters-tool-life-calculator-schema.json
import * as z from 'zod';

export interface Cutting_parameters_tool_life_calculatorInput {
  cutting_speed: number;
  feed_rate: number;
  depth_of_cut: number;
  tool_material: string;
  workpiece_material: string;
  coolant_used: boolean;
  machine_stability_factor: number;
  dataConfidence?: number;
}

export const Cutting_parameters_tool_life_calculatorInputSchema = z.object({
  cutting_speed: z.number().min(10).max(500).default(150),
  feed_rate: z.number().min(0.05).max(1).default(0.2),
  depth_of_cut: z.number().min(0.1).max(10).default(2),
  tool_material: z.enum(['high_speed_steel', 'carbide', 'ceramic', 'cbn', 'diamond']).default('carbide'),
  workpiece_material: z.enum(['steel', 'stainless_steel', 'aluminum', 'titanium', 'cast_iron', 'superalloy']).default('steel'),
  coolant_used: z.boolean().default(true),
  machine_stability_factor: z.number().min(0.5).max(1.5).default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cutting_parameters_tool_life_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cutting_speed * (input.feed_rate / 100) * input.depth_of_cut * input.machine_stability_factor; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.cutting_speed * (input.feed_rate / 100) * input.depth_of_cut * input.machine_stability_factor; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCutting_parameters_tool_life_calculator(input: Cutting_parameters_tool_life_calculatorInput): Cutting_parameters_tool_life_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Cutting_parameters_tool_life_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
