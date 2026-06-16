// Auto-generated from beam-weight-calculator-schema.json
import * as z from 'zod';

export interface Beam_weight_calculatorInput {
  beam_type: string;
  material_density: number;
  length: number;
  flange_width: number;
  flange_thickness: number;
  web_height: number;
  web_thickness: number;
  quantity: number;
  material_cost_per_kg: number;
  cutting_loss_factor: number;
  surface_condition: string;
  include_coating_weight: boolean;
}

export const Beam_weight_calculatorInputSchema = z.object({
  beam_type: z.enum(['I-beam', 'H-beam', 'C-channel', 'Angle', 'T-beam']).default('I-beam'),
  material_density: z.number().min(7000).max(9000).default(7850),
  length: z.number().min(0.5).max(30).default(6),
  flange_width: z.number().min(50).max(1000).default(200),
  flange_thickness: z.number().min(4).max(100).default(12),
  web_height: z.number().min(100).max(1200).default(300),
  web_thickness: z.number().min(3).max(50).default(8),
  quantity: z.number().min(1).max(10000).default(1),
  material_cost_per_kg: z.number().min(0.5).max(5).default(1.2),
  cutting_loss_factor: z.number().min(0).max(10).default(3),
  surface_condition: z.enum(['clean', 'rusty', 'painted', 'galvanized']).default('clean'),
  include_coating_weight: z.boolean().default(false),
});

function evaluateAllFormulas(input: Beam_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.flange_width * input.flange_thickness) + (input.web_height * input.web_thickness); results["cross_sectional_area"] = Number.isFinite(v) ? v : 0; } catch { results["cross_sectional_area"] = 0; }
  try { const v = (results["cross_sectional_area"] ?? 0) * input.length * 1e-6; results["volume_per_beam"] = Number.isFinite(v) ? v : 0; } catch { results["volume_per_beam"] = 0; }
  try { const v = (results["volume_per_beam"] ?? 0) * input.material_density; results["weight_per_beam"] = Number.isFinite(v) ? v : 0; } catch { results["weight_per_beam"] = 0; }
  results["coating_weight_per_beam"] = 0;
  try { const v = (results["weight_per_beam"] ?? 0) + (results["coating_weight_per_beam"] ?? 0); results["total_weight_per_beam"] = Number.isFinite(v) ? v : 0; } catch { results["total_weight_per_beam"] = 0; }
  try { const v = (results["total_weight_per_beam"] ?? 0) * input.quantity; results["total_weight"] = Number.isFinite(v) ? v : 0; } catch { results["total_weight"] = 0; }
  try { const v = (results["total_weight"] ?? 0) * input.material_cost_per_kg * (1 + input.cutting_loss_factor / 100); results["total_material_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_material_cost"] = 0; }
  return results;
}


export function calculateBeam_weight_calculator(input: Beam_weight_calculatorInput): Beam_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_weight"] ?? 0;
  const breakdown = {
    cross_sectional_area: values["cross_sectional_area"] ?? 0,
    volume_per_beam: values["volume_per_beam"] ?? 0,
    weight_per_beam: values["weight_per_beam"] ?? 0,
    coating_weight_per_beam: values["coating_weight_per_beam"] ?? 0,
    total_weight_per_beam: values["total_weight_per_beam"] ?? 0,
    total_material_cost: values["total_material_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Cutting Loss","Coating Overhead","Dimensional Tolerance Loss"];
  const suggestedActions: string[] = ["Optimize nesting and use CNC saw to reduce cutting loss below 3%.","If web slenderness > 100, consider stiffeners or thicker web to meet AISC 360.","For total weight > 5000 kg, negotiate bulk material discount (typically 5-10%)."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-beam comparison","Custom material database","API integration"],
  };
}


export interface Beam_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: { cross_sectional_area: number; volume_per_beam: number; weight_per_beam: number; coating_weight_per_beam: number; total_weight_per_beam: number; total_material_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
