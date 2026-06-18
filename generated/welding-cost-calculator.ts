// @ts-nocheck
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
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Welding_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weld_length_mm * input.weld_throat_mm * input.material_density_g_per_cm3 * (input.deposition_efficiency / 100); results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.weld_length_mm * input.weld_throat_mm * input.material_density_g_per_cm3 * (input.deposition_efficiency / 100) * ((input.labor_rate_per_hour / 100) * input.welding_speed_mm_per_min * input.filler_wire_cost_per_kg * input.gas_cost_per_liter); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.labor_rate_per_hour / 100) * input.welding_speed_mm_per_min * input.filler_wire_cost_per_kg * input.gas_cost_per_liter; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWelding_cost_calculator(input: Welding_cost_calculatorInput): Welding_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Real-time cost dashboard","API integration"],
  };
}


export interface Welding_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
