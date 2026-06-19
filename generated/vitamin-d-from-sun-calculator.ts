// Auto-generated from vitamin-d-from-sun-calculator-schema.json
import * as z from 'zod';

export interface Vitamin_d_from_sun_calculatorInput {
  uv_index: number;
  exposure_time_minutes: number;
  body_area_percent: number;
  skin_type: number;
  cloud_cover_percent: number;
  dataConfidence?: number;
}

export const Vitamin_d_from_sun_calculatorInputSchema = z.object({
  uv_index: z.number().default(5),
  exposure_time_minutes: z.number().default(15),
  body_area_percent: z.number().default(10),
  skin_type: z.number().default(3),
  cloud_cover_percent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vitamin_d_from_sun_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2.2 - 0.3 * input.skin_type; results["skin_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["skin_factor"] = 0; }
  try { const v = 1 - (input.cloud_cover_percent / 100) * 0.5; results["cloud_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cloud_factor"] = 0; }
  try { const v = input.uv_index * (asFormulaNumber(results["cloud_factor"])); results["effective_uv_index"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effective_uv_index"] = 0; }
  try { const v = (asFormulaNumber(results["effective_uv_index"])) * input.exposure_time_minutes * 50 * input.body_area_percent / 100 * (asFormulaNumber(results["skin_factor"])); results["estimated_vitamin_d_iu"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimated_vitamin_d_iu"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVitamin_d_from_sun_calculator(input: Vitamin_d_from_sun_calculatorInput): Vitamin_d_from_sun_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimated_vitamin_d_iu"]);
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


export interface Vitamin_d_from_sun_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
