// Auto-generated from escape-velocity-calculator-schema.json
import * as z from 'zod';

export interface Escape_velocity_calculatorInput {
  mass: number;
  radius: number;
  altitude: number;
  G: number;
}

export const Escape_velocity_calculatorInputSchema = z.object({
  mass: z.number().default(5.972e+24),
  radius: z.number().default(6371000),
  altitude: z.number().default(0),
  G: z.number().default(6.6743e-11),
});

function evaluateAllFormulas(input: Escape_velocity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.radius + input.altitude; results["effectiveRadius"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRadius"] = 0; }
  try { const v = Math.sqrt(2 * input.G * input.mass / (results["effectiveRadius"] ?? 0)); results["escVelMPS"] = Number.isFinite(v) ? v : 0; } catch { results["escVelMPS"] = 0; }
  try { const v = (results["escVelMPS"] ?? 0) / 1000; results["escVelKMPS"] = Number.isFinite(v) ? v : 0; } catch { results["escVelKMPS"] = 0; }
  return results;
}


export function calculateEscape_velocity_calculator(input: Escape_velocity_calculatorInput): Escape_velocity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["escVelMPS"] ?? 0;
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


export interface Escape_velocity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
