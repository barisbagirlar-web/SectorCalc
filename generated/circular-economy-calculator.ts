// Auto-generated from circular-economy-calculator-schema.json
import * as z from 'zod';

export interface Circular_economy_calculatorInput {
  total_material_input: number;
  recycled_input: number;
  reused_input: number;
  total_waste_generated: number;
  recycled_waste: number;
  reused_waste: number;
}

export const Circular_economy_calculatorInputSchema = z.object({
  total_material_input: z.number().default(1000),
  recycled_input: z.number().default(200),
  reused_input: z.number().default(100),
  total_waste_generated: z.number().default(300),
  recycled_waste: z.number().default(150),
  reused_waste: z.number().default(50),
});

function evaluateAllFormulas(input: Circular_economy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.recycled_input + input.reused_input; results["circular_input"] = Number.isFinite(v) ? v : 0; } catch { results["circular_input"] = 0; }
  try { const v = input.recycled_waste + input.reused_waste; results["circular_output"] = Number.isFinite(v) ? v : 0; } catch { results["circular_output"] = 0; }
  try { const v = input.total_waste_generated - (results["circular_output"] ?? 0); results["linear_output"] = Number.isFinite(v) ? v : 0; } catch { results["linear_output"] = 0; }
  try { const v = input.total_material_input + input.total_waste_generated; results["total_throughput"] = Number.isFinite(v) ? v : 0; } catch { results["total_throughput"] = 0; }
  try { const v = (((results["circular_input"] ?? 0) + (results["circular_output"] ?? 0)) / (results["total_throughput"] ?? 0)) * 100; results["circularity_index"] = Number.isFinite(v) ? v : 0; } catch { results["circularity_index"] = 0; }
  try { const v = ((input.reused_input + input.reused_waste) / (results["total_throughput"] ?? 0)) * 100; results["reuse_rate"] = Number.isFinite(v) ? v : 0; } catch { results["reuse_rate"] = 0; }
  try { const v = ((input.recycled_input + input.recycled_waste) / (results["total_throughput"] ?? 0)) * 100; results["recycling_rate"] = Number.isFinite(v) ? v : 0; } catch { results["recycling_rate"] = 0; }
  try { const v = ((input.total_waste_generated - (results["circular_output"] ?? 0)) / (results["total_throughput"] ?? 0)) * 100; results["landfill_rate"] = Number.isFinite(v) ? v : 0; } catch { results["landfill_rate"] = 0; }
  return results;
}


export function calculateCircular_economy_calculator(input: Circular_economy_calculatorInput): Circular_economy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["circularity_index"] ?? 0;
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


export interface Circular_economy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
