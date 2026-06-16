// Auto-generated from storm-sewer-calculator-schema.json
import * as z from 'zod';

export interface Storm_sewer_calculatorInput {
  catchment_area: number;
  runoff_coefficient: number;
  rainfall_intensity: number;
  pipe_diameter: number;
  pipe_slope: number;
  manning_n: number;
}

export const Storm_sewer_calculatorInputSchema = z.object({
  catchment_area: z.number().default(1),
  runoff_coefficient: z.number().default(0.7),
  rainfall_intensity: z.number().default(50),
  pipe_diameter: z.number().default(0.5),
  pipe_slope: z.number().default(0.01),
  manning_n: z.number().default(0.013),
});

function evaluateAllFormulas(input: Storm_sewer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.runoff_coefficient * input.rainfall_intensity * input.catchment_area / 360; results["required_flow"] = Number.isFinite(v) ? v : 0; } catch { results["required_flow"] = 0; }
  try { const v = Math.PI * input.pipe_diameter**2 / 4; results["full_area"] = Number.isFinite(v) ? v : 0; } catch { results["full_area"] = 0; }
  try { const v = input.pipe_diameter / 4; results["hydraulic_radius"] = Number.isFinite(v) ? v : 0; } catch { results["hydraulic_radius"] = 0; }
  try { const v = (1 / input.manning_n) * (results["full_area"] ?? 0) * (results["hydraulic_radius"] ?? 0)**(2/3) * Math.sqrt(input.pipe_slope); results["capacity_flow"] = Number.isFinite(v) ? v : 0; } catch { results["capacity_flow"] = 0; }
  try { const v = (results["capacity_flow"] ?? 0) - (results["required_flow"] ?? 0); results["margin_flow"] = Number.isFinite(v) ? v : 0; } catch { results["margin_flow"] = 0; }
  return results;
}


export function calculateStorm_sewer_calculator(input: Storm_sewer_calculatorInput): Storm_sewer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["margin_flow"] ?? 0;
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


export interface Storm_sewer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
