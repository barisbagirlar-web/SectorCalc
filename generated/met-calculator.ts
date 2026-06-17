// Auto-generated from met-calculator-schema.json
import * as z from 'zod';

export interface Met_calculatorInput {
  metValue: number;
  weightKg: number;
  durationMin: number;
  adjustmentFactor: number;
}

export const Met_calculatorInputSchema = z.object({
  metValue: z.number().default(1),
  weightKg: z.number().default(70),
  durationMin: z.number().default(30),
  adjustmentFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Met_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.metValue * input.weightKg * (input.durationMin / 60) * input.adjustmentFactor; results["totalCal"] = Number.isFinite(v) ? v : 0; } catch { results["totalCal"] = 0; }
  try { const v = (results["totalCal"] ?? 0) / input.durationMin; results["calPerMin"] = Number.isFinite(v) ? v : 0; } catch { results["calPerMin"] = 0; }
  try { const v = input.metValue * (input.durationMin / 60); results["metHours"] = Number.isFinite(v) ? v : 0; } catch { results["metHours"] = 0; }
  return results;
}


export function calculateMet_calculator(input: Met_calculatorInput): Met_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCal"] ?? 0;
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


export interface Met_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
