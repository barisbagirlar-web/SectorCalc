// Auto-generated from mandolin-calculator-schema.json
import * as z from 'zod';

export interface Mandolin_calculatorInput {
  mandolin_count: number;
  body_wood_cost: number;
  neck_wood_cost: number;
  hardware_cost: number;
  labor_hours: number;
  labor_rate: number;
  overhead_percent: number;
  profit_margin: number;
  dataConfidence?: number;
}

export const Mandolin_calculatorInputSchema = z.object({
  mandolin_count: z.number().default(1),
  body_wood_cost: z.number().default(150),
  neck_wood_cost: z.number().default(80),
  hardware_cost: z.number().default(120),
  labor_hours: z.number().default(40),
  labor_rate: z.number().default(25),
  overhead_percent: z.number().default(20),
  profit_margin: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mandolin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mandolin_count * (input.body_wood_cost + input.neck_wood_cost + input.hardware_cost); results["total_material_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_material_cost"] = 0; }
  try { const v = input.mandolin_count * input.labor_hours * input.labor_rate; results["total_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_labor_cost"] = 0; }
  try { const v = (asFormulaNumber(results["total_material_cost"])) + (asFormulaNumber(results["total_labor_cost"])); results["direct_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_cost"] = 0; }
  try { const v = (asFormulaNumber(results["direct_cost"])) * (input.overhead_percent / 100); results["overhead_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overhead_cost"] = 0; }
  try { const v = (asFormulaNumber(results["direct_cost"])) + (asFormulaNumber(results["overhead_cost"])); results["total_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  try { const v = (asFormulaNumber(results["total_cost"])) * (1 + input.profit_margin / 100); results["selling_price"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["selling_price"] = 0; }
  try { const v = (asFormulaNumber(results["total_cost"])) / input.mandolin_count; results["cost_per_unit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cost_per_unit"] = 0; }
  try { const v = (asFormulaNumber(results["selling_price"])) / input.mandolin_count; results["price_per_unit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["price_per_unit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMandolin_calculator(input: Mandolin_calculatorInput): Mandolin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["price_per_unit"]);
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


export interface Mandolin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
