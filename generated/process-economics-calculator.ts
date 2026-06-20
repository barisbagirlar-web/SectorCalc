// Auto-generated from process-economics-calculator-schema.json
import * as z from 'zod';

export interface Process_economics_calculatorInput {
  raw_material_cost: number;
  labor_cost: number;
  overhead_cost: number;
  selling_price: number;
  production_volume: number;
  defect_rate: number;
  dataConfidence?: number;
}

export const Process_economics_calculatorInputSchema = z.object({
  raw_material_cost: z.number().default(10),
  labor_cost: z.number().default(5),
  overhead_cost: z.number().default(3),
  selling_price: z.number().default(25),
  production_volume: z.number().default(1000),
  defect_rate: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Process_economics_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.raw_material_cost + input.labor_cost + input.overhead_cost; results["total_cost_per_unit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_cost_per_unit"] = Number.NaN; }
  try { const v = input.selling_price - (toNumericFormulaValue(results["total_cost_per_unit"])); results["gross_margin_per_unit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gross_margin_per_unit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["gross_margin_per_unit"])) / input.selling_price) * 100; results["gross_margin_percentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gross_margin_percentage"] = Number.NaN; }
  try { const v = input.selling_price * input.production_volume; results["total_revenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_revenue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_cost_per_unit"])) * input.production_volume; results["total_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_cost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_revenue"])) - (toNumericFormulaValue(results["total_cost"])); results["total_profit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_profit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_cost_per_unit"])) * input.production_volume * (input.defect_rate / 100); results["defect_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["defect_cost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_profit"])) - (toNumericFormulaValue(results["defect_cost"])); results["effective_profit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effective_profit"] = Number.NaN; }
  return results;
}


export function calculateProcess_economics_calculator(input: Process_economics_calculatorInput): Process_economics_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effective_profit"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
