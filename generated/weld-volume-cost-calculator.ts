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
  try { const v = ((input.plate_thickness - input.root_face) * (input.plate_thickness - input.root_face) * Math.tan(input.groove_angle * Math.PI / 360) + input.root_gap * (input.plate_thickness - input.root_face)) * input.weld_length; results["groove_volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["groove_volume"] = Number.NaN; }
  try { const v = 0.5 * input.leg_length * input.leg_length * input.weld_length; results["fillet_volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fillet_volume"] = Number.NaN; }
  try { const v = ((input.joint_type === 'fillet' ? (toNumericFormulaValue(results["fillet_volume"])) : (toNumericFormulaValue(results["groove_volume"]))) ? 1 : 0); results["total_volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_volume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_volume"])) * 7.85 / 1000; results["deposit_weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deposit_weight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deposit_weight"])) / (input.weld_process === 'SMAW' ? 0.55 : input.weld_process === 'GMAW' ? 0.80 : 0.65) * 50; results["labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["labor_cost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deposit_weight"])) * 2.5 + (toNumericFormulaValue(results["labor_cost"])); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateWeld_volume_cost_calculator(input: Weld_volume_cost_calculatorInput): Weld_volume_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Excessive root gap increases volume by up to 30%","Low deposition efficiency due to spatter and slag loss"];
  const suggestedActions: string[] = ["Optimize groove angle to 60° per AWS D1.1 to reduce filler metal","Use GMAW instead of SMAW to improve deposition efficiency by 25%"];
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
