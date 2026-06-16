// Auto-generated from body-surface-area-pediatric-calculator-schema.json
import * as z from 'zod';

export interface Body_surface_area_pediatric_calculatorInput {
  weight: number;
  height: number;
  formula: number;
  adjustment: number;
}

export const Body_surface_area_pediatric_calculatorInputSchema = z.object({
  weight: z.number().default(10),
  height: z.number().default(100),
  formula: z.number().default(1),
  adjustment: z.number().default(1),
});

function evaluateAllFormulas(input: Body_surface_area_pediatric_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((input.height * input.weight) / 3600); results["mosteller_bsa"] = Number.isFinite(v) ? v : 0; } catch { results["mosteller_bsa"] = 0; }
  try { const v = 0.007184 * Math.pow(input.weight, 0.425) * Math.pow(input.height, 0.725); results["dubois_bsa"] = Number.isFinite(v) ? v : 0; } catch { results["dubois_bsa"] = 0; }
  try { const v = 0.024265 * Math.pow(input.weight, 0.5378) * Math.pow(input.height, 0.3964); results["haycock_bsa"] = Number.isFinite(v) ? v : 0; } catch { results["haycock_bsa"] = 0; }
  try { const v = 0.0235 * Math.pow(input.weight, 0.51456) * Math.pow(input.height, 0.42246); results["gehan_bsa"] = Number.isFinite(v) ? v : 0; } catch { results["gehan_bsa"] = 0; }
  try { const v = (input.formula == 1 ? (results["mosteller_bsa"] ?? 0) : input.formula == 2 ? (results["dubois_bsa"] ?? 0) : input.formula == 3 ? (results["haycock_bsa"] ?? 0) : (results["gehan_bsa"] ?? 0)) * input.adjustment; results["bsa"] = Number.isFinite(v) ? v : 0; } catch { results["bsa"] = 0; }
  try { const v = `Mosteller: ${(results["mosteller_bsa"] ?? 0).toFixed(3)} m²`; results["breakdown1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = `DuBois: ${(results["dubois_bsa"] ?? 0).toFixed(3)} m²`; results["breakdown2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown2"] = 0; }
  try { const v = `Haycock: ${(results["haycock_bsa"] ?? 0).toFixed(3)} m²`; results["breakdown3"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown3"] = 0; }
  try { const v = `Gehan & George: ${(results["gehan_bsa"] ?? 0).toFixed(3)} m²`; results["breakdown4"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown4"] = 0; }
  return results;
}


export function calculateBody_surface_area_pediatric_calculator(input: Body_surface_area_pediatric_calculatorInput): Body_surface_area_pediatric_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bsa"] ?? 0;
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


export interface Body_surface_area_pediatric_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
