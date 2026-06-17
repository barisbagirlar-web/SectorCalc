// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Process_economics_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.raw_material_cost + input.labor_cost + input.overhead_cost; results["total_cost_per_unit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_cost_per_unit"] = 0; }
  try { const v = input.selling_price - (asFormulaNumber(results["total_cost_per_unit"])); results["gross_margin_per_unit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gross_margin_per_unit"] = 0; }
  try { const v = ((asFormulaNumber(results["gross_margin_per_unit"])) / input.selling_price) * 100; results["gross_margin_percentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gross_margin_percentage"] = 0; }
  try { const v = input.selling_price * input.production_volume; results["total_revenue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_revenue"] = 0; }
  try { const v = (asFormulaNumber(results["total_cost_per_unit"])) * input.production_volume; results["total_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_cost"] = 0; }
  try { const v = (asFormulaNumber(results["total_revenue"])) - (asFormulaNumber(results["total_cost"])); results["total_profit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_profit"] = 0; }
  try { const v = (asFormulaNumber(results["total_cost_per_unit"])) * input.production_volume * (input.defect_rate / 100); results["defect_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["defect_cost"] = 0; }
  try { const v = (asFormulaNumber(results["total_profit"])) - (asFormulaNumber(results["defect_cost"])); results["effective_profit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effective_profit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateProcess_economics_calculator(input: Process_economics_calculatorInput): Process_economics_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effective_profit"]);
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
