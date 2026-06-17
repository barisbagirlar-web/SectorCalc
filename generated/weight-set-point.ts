// Auto-generated from weight-set-point-schema.json
import * as z from 'zod';

export interface Weight_set_pointInput {
  netWeightTarget: number;
  tareWeight: number;
  processStdDev: number;
  safetyFactor: number;
}

export const Weight_set_pointInputSchema = z.object({
  netWeightTarget: z.number().default(1),
  tareWeight: z.number().default(0.1),
  processStdDev: z.number().default(0.01),
  safetyFactor: z.number().default(2),
});

function evaluateAllFormulas(input: Weight_set_pointInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.safetyFactor * input.processStdDev; results["safetyMargin"] = Number.isFinite(v) ? v : 0; } catch { results["safetyMargin"] = 0; }
  try { const v = input.netWeightTarget + (results["safetyMargin"] ?? 0); results["netSetPoint"] = Number.isFinite(v) ? v : 0; } catch { results["netSetPoint"] = 0; }
  try { const v = (results["netSetPoint"] ?? 0) + input.tareWeight; results["grossWeightSetPoint"] = Number.isFinite(v) ? v : 0; } catch { results["grossWeightSetPoint"] = 0; }
  return results;
}


export function calculateWeight_set_point(input: Weight_set_pointInput): Weight_set_pointOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grossWeightSetPoint"] ?? 0;
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


export interface Weight_set_pointOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
