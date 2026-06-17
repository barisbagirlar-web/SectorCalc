// Auto-generated from retaining-wall-design-calculator-schema.json
import * as z from 'zod';

export interface Retaining_wall_design_calculatorInput {
  H: number;
  gamma: number;
  phi: number;
  q: number;
}

export const Retaining_wall_design_calculatorInputSchema = z.object({
  H: z.number().default(3),
  gamma: z.number().default(18),
  phi: z.number().default(30),
  q: z.number().default(10),
});

function evaluateAllFormulas(input: Retaining_wall_design_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.tan(Math.PI/4 - (input.phi * Math.PI/180)/2) ** 2; results["ka"] = Number.isFinite(v) ? v : 0; } catch { results["ka"] = 0; }
  try { const v = 0.5 * (results["ka"] ?? 0) * input.gamma * input.H * input.H; results["pa"] = Number.isFinite(v) ? v : 0; } catch { results["pa"] = 0; }
  try { const v = (results["ka"] ?? 0) * input.q * input.H; results["pq"] = Number.isFinite(v) ? v : 0; } catch { results["pq"] = 0; }
  try { const v = (results["pa"] ?? 0) + (results["pq"] ?? 0); results["ptotal"] = Number.isFinite(v) ? v : 0; } catch { results["ptotal"] = 0; }
  try { const v = (results["pa"] ?? 0) * (input.H/3) + (results["pq"] ?? 0) * (input.H/2); results["M"] = Number.isFinite(v) ? v : 0; } catch { results["M"] = 0; }
  return results;
}


export function calculateRetaining_wall_design_calculator(input: Retaining_wall_design_calculatorInput): Retaining_wall_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ka"] ?? 0;
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


export interface Retaining_wall_design_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
