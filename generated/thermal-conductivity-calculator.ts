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
  measurement_confidence: string;
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
  measurement_confidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

function evaluateAllFormulas(input: Thermal_conductivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.material_type === 'insulation_foam' ? 0.04 : input.material_type === 'metal_alloy' ? 50 * (input.temperature_k / 300) ** 0.5 : input.material_type === 'ceramic' ? 3 : input.material_type === 'composite' ? 0.5 : input.material_type === 'fluid_gas' ? 0.025 : input.material_type === 'fluid_liquid' ? 0.6 : 1.0; results["k_base"] = Number.isFinite(v) ? v : 0; } catch { results["k_base"] = 0; }
  try { const v = 1 + 0.02 * input.moisture_content_pct + 0.0005 * input.moisture_content_pct ** 2; results["f_moisture"] = Number.isFinite(v) ? v : 0; } catch { results["f_moisture"] = 0; }
  try { const v = input.aging_factor; results["f_aging"] = Number.isFinite(v) ? v : 0; } catch { results["f_aging"] = 0; }
  try { const v = (results["k_base"] ?? 0) * (results["f_moisture"] ?? 0) * (results["f_aging"] ?? 0); results["k_effective"] = Number.isFinite(v) ? v : 0; } catch { results["k_effective"] = 0; }
  try { const v = input.thickness_m / (results["k_effective"] ?? 0); results["r_value"] = Number.isFinite(v) ? v : 0; } catch { results["r_value"] = 0; }
  try { const v = (results["k_effective"] ?? 0) * input.temperature_delta_k / input.thickness_m; results["q"] = Number.isFinite(v) ? v : 0; } catch { results["q"] = 0; }
  try { const v = (input.heat_flow_w / (input.cross_section_area_m2 * (results["q"] ?? 0))) * 100; results["eta_thermal"] = Number.isFinite(v) ? v : 0; } catch { results["eta_thermal"] = 0; }
  return results;
}


export function calculateThermal_conductivity_calculator(input: Thermal_conductivity_calculatorInput): Thermal_conductivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["k_effective"] ?? 0;
  const breakdown = {
    k_base: values["k_base"] ?? 0,
    f_moisture: values["f_moisture"] ?? 0,
    f_aging: values["f_aging"] ?? 0,
    r_value: values["r_value"] ?? 0,
    q: values["q"] ?? 0,
    eta_thermal: values["eta_thermal"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Moisture Impact on Conductivity","Aging Impact on Conductivity","Temperature Nonlinearity Loss"];
  const suggestedActions: string[] = ["Implement moisture barrier or drying process to reduce moisture content below 5%.","Consider material replacement or rejuvenation treatment to restore thermal performance.","Increase material thickness by 20% to meet minimum R-value standards (ISO 6946).","Recalibrate heat flux sensors and thermocouples. Perform Gage R&R study per Six Sigma."];
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-layer simulation","Custom material database"],
  };
}


export interface Thermal_conductivity_calculatorOutput {
  totalWasteCost: number;
  breakdown: { k_base: number; f_moisture: number; f_aging: number; r_value: number; q: number; eta_thermal: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
