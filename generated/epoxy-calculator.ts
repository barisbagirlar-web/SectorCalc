// Auto-generated from epoxy-calculator-schema.json
import * as z from 'zod';

export interface Epoxy_calculatorInput {
  desiredWeight: number;
  resinRatio: number;
  hardenerRatio: number;
  wasteFactor: number;
}

export const Epoxy_calculatorInputSchema = z.object({
  desiredWeight: z.number().default(1),
  resinRatio: z.number().default(100),
  hardenerRatio: z.number().default(25),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Epoxy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.resinRatio + input.hardenerRatio; results["totalParts"] = Number.isFinite(v) ? v : 0; } catch { results["totalParts"] = 0; }
  try { const v = input.desiredWeight * (1 + input.wasteFactor/100); results["adjustedWeight"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedWeight"] = 0; }
  try { const v = (results["adjustedWeight"] ?? 0) * input.resinRatio / (results["totalParts"] ?? 0); results["resinWeight"] = Number.isFinite(v) ? v : 0; } catch { results["resinWeight"] = 0; }
  try { const v = (results["adjustedWeight"] ?? 0) * input.hardenerRatio / (results["totalParts"] ?? 0); results["hardenerWeight"] = Number.isFinite(v) ? v : 0; } catch { results["hardenerWeight"] = 0; }
  return results;
}


export function calculateEpoxy_calculator(input: Epoxy_calculatorInput): Epoxy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedWeight"] ?? 0;
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


export interface Epoxy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
