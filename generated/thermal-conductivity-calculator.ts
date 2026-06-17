// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thermal_conductivity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.material_type + input.temperature_k + input.thickness_m; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.material_type + input.temperature_k + input.thickness_m; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateThermal_conductivity_calculator(input: Thermal_conductivity_calculatorInput): Thermal_conductivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
