// Auto-generated from brewsters-angle-calculator-schema.json
import * as z from 'zod';

export interface Brewsters_angle_calculatorInput {
  n1: number;
  n2: number;
  temperature: number;
  temp_coefficient: number;
  reference_temp: number;
  angle_unit: number;
}

export const Brewsters_angle_calculatorInputSchema = z.object({
  n1: z.number().default(1),
  n2: z.number().default(1.5),
  temperature: z.number().default(20),
  temp_coefficient: z.number().default(0.0001),
  reference_temp: z.number().default(20),
  angle_unit: z.number().default(0),
});

function evaluateAllFormulas(input: Brewsters_angle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.n2 + input.temp_coefficient * (input.temperature - input.reference_temp); results["corrected_n2"] = Number.isFinite(v) ? v : 0; } catch { results["corrected_n2"] = 0; }
  try { const v = Math.atan((results["corrected_n2"] ?? 0) / input.n1); results["brewster_rad"] = Number.isFinite(v) ? v : 0; } catch { results["brewster_rad"] = 0; }
  try { const v = input.angle_unit === 0 ? (results["brewster_rad"] ?? 0) * 180 / Math.PI : (results["brewster_rad"] ?? 0); results["brewster_angle"] = Number.isFinite(v) ? v : 0; } catch { results["brewster_angle"] = 0; }
  return results;
}


export function calculateBrewsters_angle_calculator(input: Brewsters_angle_calculatorInput): Brewsters_angle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["brewster_angle"] ?? 0;
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


export interface Brewsters_angle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
