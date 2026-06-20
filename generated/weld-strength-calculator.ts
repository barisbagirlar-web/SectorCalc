// Auto-generated from weld-strength-calculator-schema.json
import * as z from 'zod';

export interface Weld_strength_calculatorInput {
  weld_type: string;
  base_material_yield_strength: number;
  weld_material_tensile_strength: number;
  throat_thickness: number;
  weld_length: number;
  applied_load: number;
  load_angle: number;
  quality_level: string;
  dataConfidence?: number;
}

export const Weld_strength_calculatorInputSchema = z.object({
  weld_type: z.enum(['fillet', 'groove', 'plug', 'slot', 'butt']).default('fillet'),
  base_material_yield_strength: z.number().min(100).max(1200).default(345),
  weld_material_tensile_strength: z.number().min(200).max(1500).default(480),
  throat_thickness: z.number().min(1).max(50).default(6),
  weld_length: z.number().min(10).max(5000).default(100),
  applied_load: z.number().min(0.1).max(2000).default(50),
  load_angle: z.number().min(0).max(180).default(90),
  quality_level: z.enum(['B', 'C', 'D']).default('B'),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Weld_strength_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.base_material_yield_strength * input.weld_material_tensile_strength * input.throat_thickness * input.weld_length; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.base_material_yield_strength * input.weld_material_tensile_strength * input.throat_thickness * input.weld_length * (input.applied_load * input.load_angle); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.applied_load * input.load_angle; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateWeld_strength_calculator(input: Weld_strength_calculatorInput): Weld_strength_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-material database","Fatigue life prediction","Weld procedure specification (WPS) generator"],
  };
}


export interface Weld_strength_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
