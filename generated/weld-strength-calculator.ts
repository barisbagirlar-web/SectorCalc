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
  try { const v = input.weld_material_tensile_strength * 0.6; results["allowable_stress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowable_stress"] = Number.NaN; }
  try { const v = input.throat_thickness * input.weld_length; results["effective_area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effective_area"] = Number.NaN; }
  try { const v = Math.cos(input.load_angle * Math.PI / 180) * 0.5 + 0.5; results["load_angle_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["load_angle_factor"] = Number.NaN; }
  try { const v = input.quality_level === 'B' ? 1.0 : input.quality_level === 'C' ? 0.85 : 0.7; results["quality_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["quality_factor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["allowable_stress"])) * (toNumericFormulaValue(results["effective_area"])) * (toNumericFormulaValue(results["load_angle_factor"])) * (toNumericFormulaValue(results["quality_factor"])) / 1000; results["allowable_load"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowable_load"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["allowable_load"])) - input.applied_load; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["result"])) / input.applied_load * 100; results["safety_margin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["safety_margin"] = Number.NaN; }
  try { const v = Math.min(1, ((toNumericFormulaValue(results["allowable_load"])) - input.applied_load) / (0.1 * (toNumericFormulaValue(results["allowable_load"])))); results["process_capability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["process_capability"] = Number.NaN; }
  return results;
}


export function calculateWeld_strength_calculator(input: Weld_strength_calculatorInput): Weld_strength_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Inconsistent weld quality due to operator skill variation","Undetected porosity or lack of fusion reducing effective throat"];
  const suggestedActions: string[] = ["Implement real-time weld parameter monitoring with feedback control","Conduct periodic destructive testing to validate process capability"];
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
