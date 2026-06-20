// Auto-generated from weld-volume-cost-calculator-schema.json
import * as z from 'zod';

export interface Weld_volume_cost_calculatorInput {
  joint_type: string;
  plate_thickness: number;
  root_face: number;
  root_gap: number;
  groove_angle: number;
  weld_length: number;
  leg_length: number;
  weld_process: string;
  dataConfidence?: number;
}

export const Weld_volume_cost_calculatorInputSchema = z.object({
  joint_type: z.enum(['butt', 'single_v', 'double_v', 'fillet', 'single_bevel', 'double_bevel']).default('butt'),
  plate_thickness: z.number().min(1).max(200).default(10),
  root_face: z.number().min(0).max(10).default(2),
  root_gap: z.number().min(0).max(10).default(3),
  groove_angle: z.number().min(20).max(90).default(60),
  weld_length: z.number().min(10).max(100000).default(1000),
  leg_length: z.number().min(2).max(50).default(6),
  weld_process: z.enum(['SMAW', 'GMAW', 'FCAW', 'SAW', 'GTAW']).default('SMAW'),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Weld_volume_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.plate_thickness * input.root_face * input.root_gap * input.groove_angle; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.plate_thickness * input.root_face * input.root_gap * input.groove_angle * (input.weld_length * input.leg_length); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.weld_length * input.leg_length; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateWeld_volume_cost_calculator(input: Weld_volume_cost_calculatorInput): Weld_volume_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-user collaboration","Custom joint library","API access"],
  };
}


export interface Weld_volume_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
