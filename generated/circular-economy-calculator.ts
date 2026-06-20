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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Circular_economy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.recycled_input + input.reused_input; results["circular_input"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["circular_input"] = Number.NaN; }
  try { const v = input.recycled_waste + input.reused_waste; results["circular_output"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["circular_output"] = Number.NaN; }
  try { const v = input.total_waste_generated - (toNumericFormulaValue(results["circular_output"])); results["linear_output"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["linear_output"] = Number.NaN; }
  try { const v = input.total_material_input + input.total_waste_generated; results["total_throughput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_throughput"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["circular_input"])) + (toNumericFormulaValue(results["circular_output"]))) / (toNumericFormulaValue(results["total_throughput"]))) * 100; results["circularity_index"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["circularity_index"] = Number.NaN; }
  try { const v = ((input.reused_input + input.reused_waste) / (toNumericFormulaValue(results["total_throughput"]))) * 100; results["reuse_rate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reuse_rate"] = Number.NaN; }
  try { const v = ((input.recycled_input + input.recycled_waste) / (toNumericFormulaValue(results["total_throughput"]))) * 100; results["recycling_rate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recycling_rate"] = Number.NaN; }
  try { const v = ((input.total_waste_generated - (toNumericFormulaValue(results["circular_output"]))) / (toNumericFormulaValue(results["total_throughput"]))) * 100; results["landfill_rate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["landfill_rate"] = Number.NaN; }
  return results;
}


export function calculateCircular_economy_calculator(input: Circular_economy_calculatorInput): Circular_economy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["circularity_index"]);
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


export interface Circular_economy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
