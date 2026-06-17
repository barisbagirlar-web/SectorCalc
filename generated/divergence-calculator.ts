// Auto-generated from divergence-calculator-schema.json
import * as z from 'zod';

export interface Divergence_calculatorInput {
  dFx_dx: number;
  dFy_dy: number;
  dFz_dz: number;
  x: number;
  y: number;
  z: number;
}

export const Divergence_calculatorInputSchema = z.object({
  dFx_dx: z.number().default(0),
  dFy_dy: z.number().default(0),
  dFz_dz: z.number().default(0),
  x: z.number().default(0),
  y: z.number().default(0),
  z: z.number().default(0),
});

function evaluateAllFormulas(input: Divergence_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dFx_dx + input.dFy_dy + input.dFz_dz; results["divergence"] = Number.isFinite(v) ? v : 0; } catch { results["divergence"] = 0; }
  try { const v = input.dFx_dx; results["contributionX"] = Number.isFinite(v) ? v : 0; } catch { results["contributionX"] = 0; }
  try { const v = input.dFy_dy; results["contributionY"] = Number.isFinite(v) ? v : 0; } catch { results["contributionY"] = 0; }
  try { const v = input.dFz_dz; results["contributionZ"] = Number.isFinite(v) ? v : 0; } catch { results["contributionZ"] = 0; }
  results["_F_x__x___contributionX"] = 0;
  results["_F_y__y___contributionY"] = 0;
  results["_F_z__z___contributionZ"] = 0;
  return results;
}


export function calculateDivergence_calculator(input: Divergence_calculatorInput): Divergence_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["divergence"] ?? 0;
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


export interface Divergence_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
