// Auto-generated from hair-density-calculator-schema.json
import * as z from 'zod';

export interface Hair_density_calculatorInput {
  counted_hairs: number;
  sample_area_cm2: number;
  magnification: number;
  calibration_factor: number;
}

export const Hair_density_calculatorInputSchema = z.object({
  counted_hairs: z.number().default(100),
  sample_area_cm2: z.number().default(1),
  magnification: z.number().default(1),
  calibration_factor: z.number().default(1),
});

function evaluateAllFormulas(input: Hair_density_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.counted_hairs * input.magnification**2 * input.calibration_factor / input.sample_area_cm2; results["hair_density"] = Number.isFinite(v) ? v : 0; } catch { results["hair_density"] = 0; }
  try { const v = input.counted_hairs / input.sample_area_cm2; results["raw_density"] = Number.isFinite(v) ? v : 0; } catch { results["raw_density"] = 0; }
  try { const v = input.sample_area_cm2 / (input.magnification**2 * input.calibration_factor); results["effective_area"] = Number.isFinite(v) ? v : 0; } catch { results["effective_area"] = 0; }
  return results;
}


export function calculateHair_density_calculator(input: Hair_density_calculatorInput): Hair_density_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hair_density"] ?? 0;
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


export interface Hair_density_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
