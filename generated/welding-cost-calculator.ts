// Auto-generated from welding-cost-calculator-schema.json
import * as z from 'zod';

export interface Welding_cost_calculatorInput {
  weld_length_mm: number;
  weld_throat_mm: number;
  material_density_g_per_cm3: number;
  deposition_efficiency: number;
  labor_rate_per_hour: number;
  welding_speed_mm_per_min: number;
  filler_wire_cost_per_kg: number;
  gas_cost_per_liter: number;
  gas_flow_rate_l_per_min: number;
  energy_cost_per_kwh: number;
  welding_power_kw: number;
  overhead_rate_per_hour: number;
  rework_rate_percent: number;
  rework_cost_factor: number;
  weld_process_type: string;
  use_premium_material: boolean;
}

export const Welding_cost_calculatorInputSchema = z.object({
  weld_length_mm: z.number().min(1).max(10000).default(100),
  weld_throat_mm: z.number().min(1).max(50).default(5),
  material_density_g_per_cm3: z.number().min(2).max(20).default(7.85),
  deposition_efficiency: z.number().min(50).max(100).default(85),
  labor_rate_per_hour: z.number().min(10).max(200).default(45),
  welding_speed_mm_per_min: z.number().min(10).max(2000).default(300),
  filler_wire_cost_per_kg: z.number().min(0.5).max(50).default(3.5),
  gas_cost_per_liter: z.number().min(0.01).max(1).default(0.08),
  gas_flow_rate_l_per_min: z.number().min(5).max(50).default(18),
  energy_cost_per_kwh: z.number().min(0.02).max(0.5).default(0.12),
  welding_power_kw: z.number().min(1).max(50).default(8),
  overhead_rate_per_hour: z.number().min(0).max(100).default(15),
  rework_rate_percent: z.number().min(0).max(50).default(5),
  rework_cost_factor: z.number().min(1).max(5).default(2),
  weld_process_type: z.enum(['GMAW', 'FCAW', 'SMAW', 'GTAW', 'SAW']).default('GMAW'),
  use_premium_material: z.boolean().default(false),
});

function evaluateAllFormulas(input: Welding_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["weld_volume"] = (input.weld_length_mm / 10) * (input.weld_throat_mm / 10) * (input.weld_throat_mm / 10) / 2; } catch { results["weld_volume"] = 0; }
  try { results["filler_mass"] = (results["weld_volume"] ?? 0) * input.material_density_g_per_cm3 / 1000 / (input.deposition_efficiency / 100); } catch { results["filler_mass"] = 0; }
  try { results["labor_time"] = (input.weld_length_mm / input.welding_speed_mm_per_min) / 60; } catch { results["labor_time"] = 0; }
  try { results["filler_cost"] = (results["filler_mass"] ?? 0) * input.filler_wire_cost_per_kg * (1 + (input.use_premium_material ? 0.2 : 0)); } catch { results["filler_cost"] = 0; }
  try { results["gas_cost"] = input.gas_flow_rate_l_per_min * (input.weld_length_mm / input.welding_speed_mm_per_min) * input.gas_cost_per_liter; } catch { results["gas_cost"] = 0; }
  try { results["energy_cost"] = input.welding_power_kw * (results["labor_time"] ?? 0) * input.energy_cost_per_kwh; } catch { results["energy_cost"] = 0; }
  try { results["labor_cost"] = (results["labor_time"] ?? 0) * input.labor_rate_per_hour; } catch { results["labor_cost"] = 0; }
  try { results["overhead_cost"] = (results["labor_time"] ?? 0) * input.overhead_rate_per_hour; } catch { results["overhead_cost"] = 0; }
  try { results["rework_cost"] = ((results["filler_cost"] ?? 0) + (results["gas_cost"] ?? 0) + (results["energy_cost"] ?? 0) + (results["labor_cost"] ?? 0) + (results["overhead_cost"] ?? 0)) * (input.rework_rate_percent / 100) * input.rework_cost_factor; } catch { results["rework_cost"] = 0; }
  try { results["total_welding_cost"] = (results["filler_cost"] ?? 0) + (results["gas_cost"] ?? 0) + (results["energy_cost"] ?? 0) + (results["labor_cost"] ?? 0) + (results["overhead_cost"] ?? 0) + (results["rework_cost"] ?? 0); } catch { results["total_welding_cost"] = 0; }
  return results;
}


export function calculateWelding_cost_calculator(input: Welding_cost_calculatorInput): Welding_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_welding_cost"] ?? 0;
  const breakdown = {
    fillerCost: values["fillerCost"] ?? 0,
    gasCost: values["gasCost"] ?? 0,
    energyCost: values["energyCost"] ?? 0,
    laborCost: values["laborCost"] ?? 0,
    overheadCost: values["overheadCost"] ?? 0,
    reworkCost: values["reworkCost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Spatter Loss","Idle Time","Defect Scrap","Consumable Wear"];
  const suggestedActions: string[] = ["Increase welding speed or reduce power to lower energy and labor costs.","Implement statistical process control (SPC) to reduce rework rate below 5%.","Switch to low-spatter wire or optimize shielding gas mix.","Evaluate robotic welding for high-volume joints to reduce labor cost."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Real-time cost dashboard","API integration"],
  };
}


export interface Welding_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { fillerCost: number; gasCost: number; energyCost: number; laborCost: number; overheadCost: number; reworkCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
