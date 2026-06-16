// Auto-generated from delay-calculator-schema.json
import * as z from 'zod';

export interface Delay_calculatorInput {
  setupDelay: number;
  queueDelay: number;
  processDelay: number;
  transportDelay: number;
  unplannedDelay: number;
}

export const Delay_calculatorInputSchema = z.object({
  setupDelay: z.number().default(0),
  queueDelay: z.number().default(0),
  processDelay: z.number().default(0),
  transportDelay: z.number().default(0),
  unplannedDelay: z.number().default(0),
});

function evaluateAllFormulas(input: Delay_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.setupDelay + input.queueDelay + input.processDelay + input.transportDelay + input.unplannedDelay; results["totalDelay"] = Number.isFinite(v) ? v : 0; } catch { results["totalDelay"] = 0; }
  return results;
}


export function calculateDelay_calculator(input: Delay_calculatorInput): Delay_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDelay"] ?? 0;
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


export interface Delay_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
