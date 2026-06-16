// Auto-generated from body-surface-area-calculator-schema.json
import * as z from 'zod';

export interface Body_surface_area_calculatorInput {
  weight_kg: number;
  height_cm: number;
  weight_lb: number;
  height_in: number;
}

export const Body_surface_area_calculatorInputSchema = z.object({
  weight_kg: z.number().default(70),
  height_cm: z.number().default(170),
  weight_lb: z.number().default(154),
  height_in: z.number().default(67),
});

function evaluateAllFormulas(input: Body_surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.007184 * Math.pow((input.weight_kg > 0 ? input.weight_kg : input.weight_lb * 0.453592), 0.425) * Math.pow((input.height_cm > 0 ? input.height_cm : input.height_in * 2.54), 0.725); results["bsa_dubois_m2"] = Number.isFinite(v) ? v : 0; } catch { results["bsa_dubois_m2"] = 0; }
  try { const v = Math.sqrt(((input.weight_kg > 0 ? input.weight_kg : input.weight_lb * 0.453592) * (input.height_cm > 0 ? input.height_cm : input.height_in * 2.54)) / 3600); results["bsa_mosteller_m2"] = Number.isFinite(v) ? v : 0; } catch { results["bsa_mosteller_m2"] = 0; }
  try { const v = 0.007184 * Math.pow((input.weight_kg > 0 ? input.weight_kg : input.weight_lb * 0.453592), 0.425) * Math.pow((input.height_cm > 0 ? input.height_cm : input.height_in * 2.54), 0.725) * 10.7639; results["bsa_dubois_ft2"] = Number.isFinite(v) ? v : 0; } catch { results["bsa_dubois_ft2"] = 0; }
  return results;
}


export function calculateBody_surface_area_calculator(input: Body_surface_area_calculatorInput): Body_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bsa_dubois_m2"] ?? 0;
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


export interface Body_surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
