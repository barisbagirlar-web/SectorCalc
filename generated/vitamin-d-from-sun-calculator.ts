// Auto-generated from vitamin-d-from-sun-calculator-schema.json
import * as z from 'zod';

export interface Vitamin_d_from_sun_calculatorInput {
  uv_index: number;
  exposure_time_minutes: number;
  body_area_percent: number;
  skin_type: number;
  cloud_cover_percent: number;
}

export const Vitamin_d_from_sun_calculatorInputSchema = z.object({
  uv_index: z.number().default(5),
  exposure_time_minutes: z.number().default(15),
  body_area_percent: z.number().default(10),
  skin_type: z.number().default(3),
  cloud_cover_percent: z.number().default(0),
});

function evaluateAllFormulas(input: Vitamin_d_from_sun_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2.2 - 0.3 * input.skin_type; results["skin_factor"] = Number.isFinite(v) ? v : 0; } catch { results["skin_factor"] = 0; }
  try { const v = 1 - (input.cloud_cover_percent / 100) * 0.5; results["cloud_factor"] = Number.isFinite(v) ? v : 0; } catch { results["cloud_factor"] = 0; }
  try { const v = input.uv_index * (results["cloud_factor"] ?? 0); results["effective_uv_index"] = Number.isFinite(v) ? v : 0; } catch { results["effective_uv_index"] = 0; }
  try { const v = (results["effective_uv_index"] ?? 0) * input.exposure_time_minutes * 50 * input.body_area_percent / 100 * (results["skin_factor"] ?? 0); results["estimated_vitamin_d_iu"] = Number.isFinite(v) ? v : 0; } catch { results["estimated_vitamin_d_iu"] = 0; }
  return results;
}


export function calculateVitamin_d_from_sun_calculator(input: Vitamin_d_from_sun_calculatorInput): Vitamin_d_from_sun_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimated_vitamin_d_iu"] ?? 0;
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


export interface Vitamin_d_from_sun_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
