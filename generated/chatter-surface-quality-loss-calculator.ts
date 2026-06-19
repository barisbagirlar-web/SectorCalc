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
  dataConfidence?: number;
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
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Chatter_surface_quality_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cutting_speed * (input.feed_rate / 100) * input.depth_of_cut * input.tool_overhang; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.cutting_speed * (input.feed_rate / 100) * input.depth_of_cut * input.tool_overhang * (input.tool_diameter * input.machine_spindle_power * input.machine_damping_ratio); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.tool_diameter * input.machine_spindle_power * input.machine_damping_ratio; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateChatter_surface_quality_loss_calculator(input: Chatter_surface_quality_loss_calculatorInput): Chatter_surface_quality_loss_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time monitoring","Multi-machine comparison"],
  };
}


export interface Chatter_surface_quality_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
