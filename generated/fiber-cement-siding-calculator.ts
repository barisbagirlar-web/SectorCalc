// Auto-generated from fiber-cement-siding-calculator-schema.json
import * as z from 'zod';

export interface Fiber_cement_siding_calculatorInput {
  wall_length: number;
  wall_height: number;
  siding_width: number;
  siding_overlap: number;
  waste_factor: number;
  labor_rate: number;
  material_cost: number;
}

export const Fiber_cement_siding_calculatorInputSchema = z.object({
  wall_length: z.number().default(10),
  wall_height: z.number().default(3),
  siding_width: z.number().default(0.2),
  siding_overlap: z.number().default(0.025),
  waste_factor: z.number().default(10),
  labor_rate: z.number().default(15),
  material_cost: z.number().default(25),
});

function evaluateAllFormulas(input: Fiber_cement_siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wall_length * input.wall_height; results["net_area"] = Number.isFinite(v) ? v : 0; } catch { results["net_area"] = 0; }
  try { const v = input.siding_width - input.siding_overlap; results["exposed_width"] = Number.isFinite(v) ? v : 0; } catch { results["exposed_width"] = 0; }
  try { const v = Math.ceil(input.wall_height / (results["exposed_width"] ?? 0)); results["courses"] = Number.isFinite(v) ? v : 0; } catch { results["courses"] = 0; }
  try { const v = (results["courses"] ?? 0) * input.wall_length; results["total_siding_length"] = Number.isFinite(v) ? v : 0; } catch { results["total_siding_length"] = 0; }
  try { const v = (results["total_siding_length"] ?? 0) * input.siding_width; results["gross_area"] = Number.isFinite(v) ? v : 0; } catch { results["gross_area"] = 0; }
  try { const v = 1 + input.waste_factor / 100; results["waste_multiplier"] = Number.isFinite(v) ? v : 0; } catch { results["waste_multiplier"] = 0; }
  try { const v = (results["gross_area"] ?? 0) * (results["waste_multiplier"] ?? 0); results["material_needed"] = Number.isFinite(v) ? v : 0; } catch { results["material_needed"] = 0; }
  try { const v = (results["material_needed"] ?? 0) * input.material_cost; results["material_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["material_cost_total"] = 0; }
  try { const v = (results["net_area"] ?? 0) * input.labor_rate; results["labor_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost_total"] = 0; }
  try { const v = (results["material_cost_total"] ?? 0) + (results["labor_cost_total"] ?? 0); results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  return results;
}


export function calculateFiber_cement_siding_calculator(input: Fiber_cement_siding_calculatorInput): Fiber_cement_siding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost"] ?? 0;
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


export interface Fiber_cement_siding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
