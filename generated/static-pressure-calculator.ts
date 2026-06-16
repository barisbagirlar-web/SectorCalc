// Auto-generated from static-pressure-calculator-schema.json
import * as z from 'zod';

export interface Static_pressure_calculatorInput {
  density: number;
  gravity: number;
  height: number;
  atmPressure: number;
}

export const Static_pressure_calculatorInputSchema = z.object({
  density: z.number().default(1000),
  gravity: z.number().default(9.81),
  height: z.number().default(0),
  atmPressure: z.number().default(101325),
});

function evaluateAllFormulas(input: Static_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.density * input.gravity * input.height; results["pressure"] = Number.isFinite(v) ? v : 0; } catch { results["pressure"] = 0; }
  try { const v = input.atmPressure + (results["pressure"] ?? 0); results["absolutePressure"] = Number.isFinite(v) ? v : 0; } catch { results["absolutePressure"] = 0; }
  return results;
}


export function calculateStatic_pressure_calculator(input: Static_pressure_calculatorInput): Static_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pressure"] ?? 0;
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


export interface Static_pressure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
