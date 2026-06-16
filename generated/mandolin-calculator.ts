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

function evaluateAllFormulas(input: Mandolin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mandolin_count * (input.body_wood_cost + input.neck_wood_cost + input.hardware_cost); results["total_material_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_material_cost"] = 0; }
  try { const v = input.mandolin_count * input.labor_hours * input.labor_rate; results["total_labor_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_labor_cost"] = 0; }
  try { const v = (results["total_material_cost"] ?? 0) + (results["total_labor_cost"] ?? 0); results["direct_cost"] = Number.isFinite(v) ? v : 0; } catch { results["direct_cost"] = 0; }
  try { const v = (results["direct_cost"] ?? 0) * (input.overhead_percent / 100); results["overhead_cost"] = Number.isFinite(v) ? v : 0; } catch { results["overhead_cost"] = 0; }
  try { const v = (results["direct_cost"] ?? 0) + (results["overhead_cost"] ?? 0); results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  try { const v = (results["total_cost"] ?? 0) * (1 + input.profit_margin / 100); results["selling_price"] = Number.isFinite(v) ? v : 0; } catch { results["selling_price"] = 0; }
  try { const v = (results["total_cost"] ?? 0) / input.mandolin_count; results["cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["cost_per_unit"] = 0; }
  try { const v = (results["selling_price"] ?? 0) / input.mandolin_count; results["price_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["price_per_unit"] = 0; }
  return results;
}


export function calculateMandolin_calculator(input: Mandolin_calculatorInput): Mandolin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["price_per_unit"] ?? 0;
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


export interface Mandolin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
