// Auto-generated from pressure-vessel-thickness-calculator-schema.json
import * as z from 'zod';

export interface Pressure_vessel_thickness_calculatorInput {
  design_pressure: number;
  vessel_diameter: number;
  allowable_stress: number;
  joint_efficiency: string;
  corrosion_allowance: number;
  material_utilization: number;
  safety_factor_override: boolean;
  custom_safety_factor: number;
  dataConfidence?: number;
}

export const Pressure_vessel_thickness_calculatorInputSchema = z.object({
  design_pressure: z.number().min(0.1).max(50).default(1),
  vessel_diameter: z.number().min(100).max(10000).default(1000),
  allowable_stress: z.number().min(50).max(500).default(138),
  joint_efficiency: z.enum(['1', '0.85', '0.7']).default('1'),
  corrosion_allowance: z.number().min(0).max(25).default(3),
  material_utilization: z.number().min(50).max(100).default(85),
  safety_factor_override: z.boolean().default(false),
  custom_safety_factor: z.number().min(2).max(6).default(3.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pressure_vessel_thickness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.design_pressure * input.vessel_diameter * input.allowable_stress * input.corrosion_allowance; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.design_pressure * input.vessel_diameter * input.allowable_stress * input.corrosion_allowance * ((input.material_utilization / 100) * input.custom_safety_factor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.material_utilization / 100) * input.custom_safety_factor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculatePressure_vessel_thickness_calculator(input: Pressure_vessel_thickness_calculatorInput): Pressure_vessel_thickness_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Material database sync","Multi-user collaboration","API access"],
  };
}


export interface Pressure_vessel_thickness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
