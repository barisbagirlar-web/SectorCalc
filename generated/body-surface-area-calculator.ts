// Auto-generated from body-surface-area-calculator-schema.json
import * as z from 'zod';

export interface Body_surface_area_calculatorInput {
  weight_kg: number;
  height_cm: number;
  weight_lb: number;
  height_in: number;
  dataConfidence?: number;
}

export const Body_surface_area_calculatorInputSchema = z.object({
  weight_kg: z.number().default(70),
  height_cm: z.number().default(170),
  weight_lb: z.number().default(154),
  height_in: z.number().default(67),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Body_surface_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight_kg * input.height_cm * input.weight_lb * input.height_in; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.weight_kg * input.height_cm * input.weight_lb * input.height_in; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBody_surface_area_calculator(input: Body_surface_area_calculatorInput): Body_surface_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Body_surface_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
