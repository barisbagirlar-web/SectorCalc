// Auto-generated from lightweight-cost-savings-calculator-schema.json
import * as z from 'zod';

export interface Lightweight_cost_savings_calculatorInput {
  current_weight_kg: number;
  new_weight_kg: number;
  annual_volume_units: number;
  material_cost_per_kg: number;
  shipping_cost_per_kg: number;
  waste_rate_percent: number;
  labor_hours_per_unit: number;
  labor_rate_per_hour: number;
  energy_cost_per_kwh: number;
  energy_consumption_per_kg: number;
  overhead_rate_percent: number;
  material_type: string;
  use_recycled_content: boolean;
}

export const Lightweight_cost_savings_calculatorInputSchema = z.object({
  current_weight_kg: z.number().min(0.1).max(10000).default(10),
  new_weight_kg: z.number().min(0.1).max(10000).default(8),
  annual_volume_units: z.number().min(1).max(1000000000).default(100000),
  material_cost_per_kg: z.number().min(0).max(1000).default(2.5),
  shipping_cost_per_kg: z.number().min(0).max(100).default(0.3),
  waste_rate_percent: z.number().min(0).max(100).default(5),
  labor_hours_per_unit: z.number().min(0).max(100).default(0.5),
  labor_rate_per_hour: z.number().min(0).max(500).default(20),
  energy_cost_per_kwh: z.number().min(0).max(10).default(0.12),
  energy_consumption_per_kg: z.number().min(0).max(100).default(2),
  overhead_rate_percent: z.number().min(0).max(500).default(20),
  material_type: z.enum(['plastic', 'metal', 'composite', 'glass', 'paper']).default('plastic'),
  use_recycled_content: z.boolean().default(false),
});

function evaluateAllFormulas(input: Lightweight_cost_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.current_weight_kg - input.new_weight_kg; results["weight_reduction_kg"] = Number.isFinite(v) ? v : 0; } catch { results["weight_reduction_kg"] = 0; }
  try { const v = (results["weight_reduction_kg"] ?? 0) * input.material_cost_per_kg * (1 + input.waste_rate_percent / 100); results["material_savings_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["material_savings_per_unit"] = 0; }
  try { const v = (results["weight_reduction_kg"] ?? 0) * input.shipping_cost_per_kg; results["shipping_savings_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["shipping_savings_per_unit"] = 0; }
  try { const v = (results["weight_reduction_kg"] ?? 0) * input.energy_consumption_per_kg * input.energy_cost_per_kwh; results["energy_savings_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["energy_savings_per_unit"] = 0; }
  try { const v = (results["weight_reduction_kg"] ?? 0) * 0.1 * input.labor_hours_per_unit * input.labor_rate_per_hour; results["labor_savings_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["labor_savings_per_unit"] = 0; }
  try { const v = ((results["material_savings_per_unit"] ?? 0) + (results["shipping_savings_per_unit"] ?? 0) + (results["energy_savings_per_unit"] ?? 0) + (results["labor_savings_per_unit"] ?? 0)) * (input.overhead_rate_percent / 100); results["overhead_savings_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["overhead_savings_per_unit"] = 0; }
  try { const v = ((results["material_savings_per_unit"] ?? 0) + (results["shipping_savings_per_unit"] ?? 0) + (results["energy_savings_per_unit"] ?? 0) + (results["labor_savings_per_unit"] ?? 0) + (results["overhead_savings_per_unit"] ?? 0)) * input.annual_volume_units; results["total_annual_savings"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_savings"] = 0; }
  return results;
}


export function calculateLightweight_cost_savings_calculator(input: Lightweight_cost_savings_calculatorInput): Lightweight_cost_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_savings"] ?? 0;
  const breakdown = {
    material_savings_annual: values["material_savings_annual"] ?? 0,
    shipping_savings_annual: values["shipping_savings_annual"] ?? 0,
    energy_savings_annual: values["energy_savings_annual"] ?? 0,
    labor_savings_annual: values["labor_savings_annual"] ?? 0,
    overhead_savings_annual: values["overhead_savings_annual"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Waste Inefficiency","Low Volume","High Overhead Rate","Material Type Premium"];
  const suggestedActions: string[] = ["Increase Production Volume","Reduce Waste Rate","Negotiate Shipping Rates","Adopt Recycled Content","Automate Material Handling"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Custom reporting"],
  };
}


export interface Lightweight_cost_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: { material_savings_annual: number; shipping_savings_annual: number; energy_savings_annual: number; labor_savings_annual: number; overhead_savings_annual: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
