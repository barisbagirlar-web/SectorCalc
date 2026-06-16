// Auto-generated from cronometer-calculator-schema.json
import * as z from 'zod';

export interface Cronometer_calculatorInput {
  observedTime: number;
  ratingFactor: number;
  allowanceFactor: number;
  contingencyFactor: number;
}

export const Cronometer_calculatorInputSchema = z.object({
  observedTime: z.number().default(60),
  ratingFactor: z.number().default(100),
  allowanceFactor: z.number().default(10),
  contingencyFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Cronometer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.observedTime * (input.ratingFactor / 100) * (1 + (input.allowanceFactor + input.contingencyFactor) / 100); results["standardTime"] = Number.isFinite(v) ? v : 0; } catch { results["standardTime"] = 0; }
  try { const v = input.observedTime * (input.ratingFactor / 100); results["effectiveTime"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveTime"] = 0; }
  try { const v = input.observedTime * (input.ratingFactor / 100) * ((input.allowanceFactor + input.contingencyFactor) / 100); results["allowancesTime"] = Number.isFinite(v) ? v : 0; } catch { results["allowancesTime"] = 0; }
  return results;
}


export function calculateCronometer_calculator(input: Cronometer_calculatorInput): Cronometer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["standardTime"] ?? 0;
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


export interface Cronometer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
