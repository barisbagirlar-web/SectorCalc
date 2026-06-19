// Auto-generated from circular-economy-calculator-schema.json
import * as z from 'zod';

export interface Circular_economy_calculatorInput {
  total_material_input: number;
  recycled_input: number;
  reused_input: number;
  total_waste_generated: number;
  recycled_waste: number;
  reused_waste: number;
  dataConfidence?: number;
}

export const Circular_economy_calculatorInputSchema = z.object({
  total_material_input: z.number().default(1000),
  recycled_input: z.number().default(200),
  reused_input: z.number().default(100),
  total_waste_generated: z.number().default(300),
  recycled_waste: z.number().default(150),
  reused_waste: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Circular_economy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.recycled_input + input.reused_input; results["circular_input"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["circular_input"] = 0; }
  try { const v = input.recycled_waste + input.reused_waste; results["circular_output"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["circular_output"] = 0; }
  try { const v = input.total_waste_generated - (asFormulaNumber(results["circular_output"])); results["linear_output"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["linear_output"] = 0; }
  try { const v = input.total_material_input + input.total_waste_generated; results["total_throughput"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_throughput"] = 0; }
  try { const v = (((asFormulaNumber(results["circular_input"])) + (asFormulaNumber(results["circular_output"]))) / (asFormulaNumber(results["total_throughput"]))) * 100; results["circularity_index"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["circularity_index"] = 0; }
  try { const v = ((input.reused_input + input.reused_waste) / (asFormulaNumber(results["total_throughput"]))) * 100; results["reuse_rate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reuse_rate"] = 0; }
  try { const v = ((input.recycled_input + input.recycled_waste) / (asFormulaNumber(results["total_throughput"]))) * 100; results["recycling_rate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recycling_rate"] = 0; }
  try { const v = ((input.total_waste_generated - (asFormulaNumber(results["circular_output"]))) / (asFormulaNumber(results["total_throughput"]))) * 100; results["landfill_rate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["landfill_rate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCircular_economy_calculator(input: Circular_economy_calculatorInput): Circular_economy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["circularity_index"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
