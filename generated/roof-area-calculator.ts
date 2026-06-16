// Auto-generated from roof-area-calculator-schema.json
import * as z from 'zod';

export interface Roof_area_calculatorInput {
  building_length: number;
  building_width: number;
  roof_pitch: number;
  overhang_length: number;
  roof_type: string;
  number_of_floors: number;
  waste_factor_percent: number;
}

export const Roof_area_calculatorInputSchema = z.object({
  building_length: z.number().min(1).max(500).default(30),
  building_width: z.number().min(1).max(200).default(20),
  roof_pitch: z.number().min(0.1).max(2).default(0.5),
  overhang_length: z.number().min(0).max(3).default(0.6),
  roof_type: z.enum(['gable', 'hip', 'flat', 'shed']).default('gable'),
  number_of_floors: z.number().min(1).max(10).default(1),
  waste_factor_percent: z.number().min(0).max(30).default(10),
});

function evaluateAllFormulas(input: Roof_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.building_length + 2 * input.overhang_length) * (input.building_width + 2 * input.overhang_length); results["base_footprint_area"] = Number.isFinite(v) ? v : 0; } catch { results["base_footprint_area"] = 0; }
  try { const v = Math.sqrt(1 + input.roof_pitch**2); results["pitch_factor"] = Number.isFinite(v) ? v : 0; } catch { results["pitch_factor"] = 0; }
  try { const v = (results["base_footprint_area"] ?? 0) * (results["pitch_factor"] ?? 0); results["gross_roof_area"] = Number.isFinite(v) ? v : 0; } catch { results["gross_roof_area"] = 0; }
  try { const v = (input.roof_type === 'gable' ? 1.0 : (input.roof_type === 'hip' ? 1.15 : (input.roof_type === 'flat' ? 1.0 : (input.roof_type === 'shed' ? 1.05 : 0)))); results["type_adjustment_factor"] = Number.isFinite(v) ? v : 0; } catch { results["type_adjustment_factor"] = 0; }
  try { const v = (results["gross_roof_area"] ?? 0) * (results["type_adjustment_factor"] ?? 0); results["adjusted_roof_area"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_roof_area"] = 0; }
  try { const v = (results["adjusted_roof_area"] ?? 0) * (1 + input.waste_factor_percent / 100); results["waste_adjusted_area"] = Number.isFinite(v) ? v : 0; } catch { results["waste_adjusted_area"] = 0; }
  try { const v = (results["adjusted_roof_area"] ?? 0); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateRoof_area_calculator(input: Roof_area_calculatorInput): Roof_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["net_roof_area"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    footprint_area: values["footprint_area"] ?? 0,
    pitch_factor: values["pitch_factor"] ?? 0,
    gross_roof_area: values["gross_roof_area"] ?? 0,
    type_adjustment_factor: values["type_adjustment_factor"] ?? 0,
    adjusted_roof_area: values["adjusted_roof_area"] ?? 0,
    waste_adjusted_area: values["waste_adjusted_area"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Complexity Loss (type factor >1.0)","Waste Loss","Pitch Penalty"];
  const suggestedActions: string[] = ["Implement Lean 5S and standardized work to reduce waste factor below 10%.","Consider reducing pitch to 0.5-0.75 to lower material cost and improve safety.","Evaluate if a simpler roof type (gable) can meet functional requirements, reducing area by up to 15%.","Reduce overhang to 0.6 m standard to cut material and wind load."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated report generation"],
  };
}


export interface Roof_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: { footprint_area: number; pitch_factor: number; gross_roof_area: number; type_adjustment_factor: number; adjusted_roof_area: number; waste_adjusted_area: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
