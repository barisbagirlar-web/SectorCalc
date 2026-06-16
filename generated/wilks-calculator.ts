// Auto-generated from wilks-calculator-schema.json
import * as z from 'zod';

export interface Wilks_calculatorInput {
  bodyWeight: number;
  weightLifted: number;
  gender: number;
  adjustmentFactor: number;
}

export const Wilks_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(80),
  weightLifted: z.number().default(100),
  gender: z.number().default(1),
  adjustmentFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Wilks_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.gender === 1) ? 500 / (-216.0475144 + 16.2606339 * input.bodyWeight - 0.002388645 * input.bodyWeight ** 2 - 0.00113732 * input.bodyWeight ** 3 + 7.01863e-6 * input.bodyWeight ** 4 - 1.291e-8 * input.bodyWeight ** 5) : 500 / (594.31747775582 - 27.23842536447 * input.bodyWeight + 0.82112226871 * input.bodyWeight ** 2 - 0.00930733913 * input.bodyWeight ** 3 + 4.731582e-5 * input.bodyWeight ** 4 - 9.054e-8 * input.bodyWeight ** 5); results["wilksCoefficient"] = Number.isFinite(v) ? v : 0; } catch { results["wilksCoefficient"] = 0; }
  try { const v = input.weightLifted * (results["wilksCoefficient"] ?? 0) * (input.adjustmentFactor || 1); results["wilksScore"] = Number.isFinite(v) ? v : 0; } catch { results["wilksScore"] = 0; }
  try { const v = input.weightLifted * (results["wilksCoefficient"] ?? 0); results["adjustedWeight"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedWeight"] = 0; }
  return results;
}


export function calculateWilks_calculator(input: Wilks_calculatorInput): Wilks_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Wilks_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
