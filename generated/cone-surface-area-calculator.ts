// Auto-generated from cone-surface-area-calculator-schema.json
import * as z from 'zod';

export interface Cone_surface_area_calculatorInput {
  radius: number;
  height: number;
  auto_input_3: number;
}

export const Cone_surface_area_calculatorInputSchema = z.object({
  radius: z.number().default(5),
  height: z.number().default(10),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Cone_surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.radius**2 + input.height**2); results["slantHeight"] = Number.isFinite(v) ? v : 0; } catch { results["slantHeight"] = 0; }
  try { const v = Math.PI * input.radius * (results["slantHeight"] ?? 0); results["lateralArea"] = Number.isFinite(v) ? v : 0; } catch { results["lateralArea"] = 0; }
  try { const v = Math.PI * input.radius**2; results["baseArea"] = Number.isFinite(v) ? v : 0; } catch { results["baseArea"] = 0; }
  try { const v = (results["lateralArea"] ?? 0) + (results["baseArea"] ?? 0); results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  return results;
}


export function calculateCone_surface_area_calculator(input: Cone_surface_area_calculatorInput): Cone_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalArea"] ?? 0;
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


export interface Cone_surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
