// Auto-generated from circumference-calculator-schema.json
import * as z from 'zod';

export interface Circumference_calculatorInput {
  radius: number;
  diameter: number;
  area: number;
  conversionFactor: number;
  decimalPlaces: number;
}

export const Circumference_calculatorInputSchema = z.object({
  radius: z.number().default(0),
  diameter: z.number().default(0),
  area: z.number().default(0),
  conversionFactor: z.number().default(1),
  decimalPlaces: z.number().default(2),
});

function evaluateAllFormulas(input: Circumference_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.radius * input.conversionFactor || (input.diameter * input.conversionFactor) / 2 || Math.sqrt((input.area * input.conversionFactor * input.conversionFactor) / Math.PI) || 0; results["effectiveRadius"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRadius"] = 0; }
  try { const v = (results["effectiveRadius"] ?? 0) * 2; results["effectiveDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveDiameter"] = 0; }
  try { const v = Number((Math.PI * (results["effectiveDiameter"] ?? 0)).toFixed(input.decimalPlaces)); results["circum"] = Number.isFinite(v) ? v : 0; } catch { results["circum"] = 0; }
  try { const v = Number((results["effectiveRadius"] ?? 0).toFixed(input.decimalPlaces)); results["radius_out"] = Number.isFinite(v) ? v : 0; } catch { results["radius_out"] = 0; }
  try { const v = Number((results["effectiveDiameter"] ?? 0).toFixed(input.decimalPlaces)); results["diameter_out"] = Number.isFinite(v) ? v : 0; } catch { results["diameter_out"] = 0; }
  try { const v = Number((Math.PI * (results["effectiveRadius"] ?? 0) ** 2).toFixed(input.decimalPlaces)); results["area_out"] = Number.isFinite(v) ? v : 0; } catch { results["area_out"] = 0; }
  return results;
}


export function calculateCircumference_calculator(input: Circumference_calculatorInput): Circumference_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["circum"] ?? 0;
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


export interface Circumference_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
