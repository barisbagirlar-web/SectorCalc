// Auto-generated from process-economics-calculator-schema.json
import * as z from 'zod';

export interface Process_economics_calculatorInput {
  raw_material_cost: number;
  labor_cost: number;
  overhead_cost: number;
  selling_price: number;
  production_volume: number;
  defect_rate: number;
}

export const Process_economics_calculatorInputSchema = z.object({
  raw_material_cost: z.number().default(10),
  labor_cost: z.number().default(5),
  overhead_cost: z.number().default(3),
  selling_price: z.number().default(25),
  production_volume: z.number().default(1000),
  defect_rate: z.number().default(2),
});

function evaluateAllFormulas(input: Process_economics_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.raw_material_cost + input.labor_cost + input.overhead_cost; results["total_cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost_per_unit"] = 0; }
  try { const v = input.selling_price - (results["total_cost_per_unit"] ?? 0); results["gross_margin_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["gross_margin_per_unit"] = 0; }
  try { const v = ((results["gross_margin_per_unit"] ?? 0) / input.selling_price) * 100; results["gross_margin_percentage"] = Number.isFinite(v) ? v : 0; } catch { results["gross_margin_percentage"] = 0; }
  try { const v = input.selling_price * input.production_volume; results["total_revenue"] = Number.isFinite(v) ? v : 0; } catch { results["total_revenue"] = 0; }
  try { const v = (results["total_cost_per_unit"] ?? 0) * input.production_volume; results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  try { const v = (results["total_revenue"] ?? 0) - (results["total_cost"] ?? 0); results["total_profit"] = Number.isFinite(v) ? v : 0; } catch { results["total_profit"] = 0; }
  try { const v = (results["total_cost_per_unit"] ?? 0) * input.production_volume * (input.defect_rate / 100); results["defect_cost"] = Number.isFinite(v) ? v : 0; } catch { results["defect_cost"] = 0; }
  try { const v = (results["total_profit"] ?? 0) - (results["defect_cost"] ?? 0); results["effective_profit"] = Number.isFinite(v) ? v : 0; } catch { results["effective_profit"] = 0; }
  return results;
}


export function calculateProcess_economics_calculator(input: Process_economics_calculatorInput): Process_economics_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effective_profit"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    premiumFeatures: [],
  };
}


export interface Process_economics_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
