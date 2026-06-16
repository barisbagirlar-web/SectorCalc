// Auto-generated from archery-calculator-schema.json
import * as z from 'zod';

export interface Archery_calculatorInput {
  bowIboSpeed: number;
  drawWeight: number;
  drawLength: number;
  arrowWeight: number;
}

export const Archery_calculatorInputSchema = z.object({
  bowIboSpeed: z.number().default(300),
  drawWeight: z.number().default(70),
  drawLength: z.number().default(30),
  arrowWeight: z.number().default(350),
});

function evaluateAllFormulas(input: Archery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bowIboSpeed + (input.drawWeight - 70) * 1.5 - (30 - input.drawLength) * 10 - (input.arrowWeight - 350) / 3; results["velocityFtPerSec"] = Number.isFinite(v) ? v : 0; } catch { results["velocityFtPerSec"] = 0; }
  try { const v = (input.arrowWeight * (results["velocityFtPerSec"] ?? 0) ** 2) / 450240; results["kineticEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["kineticEnergy"] = 0; }
  try { const v = input.arrowWeight * (results["velocityFtPerSec"] ?? 0) / 225400; results["momentum"] = Number.isFinite(v) ? v : 0; } catch { results["momentum"] = 0; }
  return results;
}


export function calculateArchery_calculator(input: Archery_calculatorInput): Archery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Arrow"] ?? 0;
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


export interface Archery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
