// Auto-generated from paint-coverage-calculator-schema.json
import * as z from 'zod';

export interface Paint_coverage_calculatorInput {
  area_sqm: number;
  coats: number;
  coverage_per_liter: number;
  waste_factor: number;
  roughness_factor: number;
  paint_price_per_liter: number;
}

export const Paint_coverage_calculatorInputSchema = z.object({
  area_sqm: z.number().default(50),
  coats: z.number().default(2),
  coverage_per_liter: z.number().default(12),
  waste_factor: z.number().default(10),
  roughness_factor: z.number().default(1.2),
  paint_price_per_liter: z.number().default(30),
});

function evaluateAllFormulas(input: Paint_coverage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.area_sqm * input.coats) / (input.coverage_per_liter / input.roughness_factor) * (1 + input.waste_factor / 100); results["paint_liters"] = Number.isFinite(v) ? v : 0; } catch { results["paint_liters"] = 0; }
  try { const v = (input.area_sqm * input.coats) / (input.coverage_per_liter / input.roughness_factor) * (1 + input.waste_factor / 100) * input.paint_price_per_liter; results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  return results;
}


export function calculatePaint_coverage_calculator(input: Paint_coverage_calculatorInput): Paint_coverage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["paint_liters"] ?? 0;
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


export interface Paint_coverage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
