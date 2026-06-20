// Auto-generated from storm-sewer-calculator-schema.json
import * as z from 'zod';

export interface Storm_sewer_calculatorInput {
  catchment_area: number;
  runoff_coefficient: number;
  rainfall_intensity: number;
  pipe_diameter: number;
  pipe_slope: number;
  manning_n: number;
  dataConfidence?: number;
}

export const Storm_sewer_calculatorInputSchema = z.object({
  catchment_area: z.number().default(1),
  runoff_coefficient: z.number().default(0.7),
  rainfall_intensity: z.number().default(50),
  pipe_diameter: z.number().default(0.5),
  pipe_slope: z.number().default(0.01),
  manning_n: z.number().default(0.013),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Storm_sewer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.runoff_coefficient * input.rainfall_intensity * input.catchment_area / 360; results["required_flow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["required_flow"] = Number.NaN; }
  try { const v = Math.PI * input.pipe_diameter**2 / 4; results["full_area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["full_area"] = Number.NaN; }
  try { const v = input.pipe_diameter / 4; results["hydraulic_radius"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hydraulic_radius"] = Number.NaN; }
  return results;
}


export function calculateStorm_sewer_calculator(input: Storm_sewer_calculatorInput): Storm_sewer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hydraulic_radius"]);
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


export interface Storm_sewer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
