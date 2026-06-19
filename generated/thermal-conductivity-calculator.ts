// Auto-generated from thermal-conductivity-calculator-schema.json
import * as z from 'zod';

export interface Thermal_conductivity_calculatorInput {
  material_type: string;
  temperature_k: number;
  thickness_m: number;
  cross_section_area_m2: number;
  heat_flow_w: number;
  temperature_delta_k: number;
  moisture_content_pct: number;
  aging_factor: number;
  dataConfidence?: number;
}

export const Thermal_conductivity_calculatorInputSchema = z.object({
  material_type: z.enum(['generic_solid', 'insulation_foam', 'metal_alloy', 'ceramic', 'composite', 'fluid_gas', 'fluid_liquid']).default('generic_solid'),
  temperature_k: z.number().min(100).max(2000).default(300),
  thickness_m: z.number().min(0.001).max(1).default(0.05),
  cross_section_area_m2: z.number().min(0.0001).max(100).default(1),
  heat_flow_w: z.number().min(0.1).max(100000).default(100),
  temperature_delta_k: z.number().min(0.1).max(500).default(50),
  moisture_content_pct: z.number().min(0).max(100).default(0),
  aging_factor: z.number().min(0.5).max(2).default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thermal_conductivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.temperature_k * input.thickness_m * input.cross_section_area_m2 * input.heat_flow_w; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.temperature_k * input.thickness_m * input.cross_section_area_m2 * input.heat_flow_w * (input.temperature_delta_k * (input.moisture_content_pct / 100) * input.aging_factor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.temperature_delta_k * (input.moisture_content_pct / 100) * input.aging_factor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateThermal_conductivity_calculator(input: Thermal_conductivity_calculatorInput): Thermal_conductivity_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-layer simulation","Custom material database"],
  };
}


export interface Thermal_conductivity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
