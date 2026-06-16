// Auto-generated from confidence-interval-for-proportion-calculator-schema.json
import * as z from 'zod';

export interface Confidence_interval_for_proportion_calculatorInput {
  sampleSize: number;
  successes: number;
  zValue: number;
  confidenceLevel: number;
}

export const Confidence_interval_for_proportion_calculatorInputSchema = z.object({
  sampleSize: z.number().default(100),
  successes: z.number().default(50),
  zValue: z.number().default(1.96),
  confidenceLevel: z.number().default(0.95),
});

function evaluateAllFormulas(input: Confidence_interval_for_proportion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.successes / input.sampleSize; results["p"] = Number.isFinite(v) ? v : 0; } catch { results["p"] = 0; }
  try { const v = Math.sqrt((results["p"] ?? 0) * (1 - (results["p"] ?? 0)) / input.sampleSize); results["se"] = Number.isFinite(v) ? v : 0; } catch { results["se"] = 0; }
  try { const v = input.zValue * (results["se"] ?? 0); results["me"] = Number.isFinite(v) ? v : 0; } catch { results["me"] = 0; }
  try { const v = (results["p"] ?? 0) - (results["me"] ?? 0); results["lower"] = Number.isFinite(v) ? v : 0; } catch { results["lower"] = 0; }
  try { const v = (results["p"] ?? 0) + (results["me"] ?? 0); results["upper"] = Number.isFinite(v) ? v : 0; } catch { results["upper"] = 0; }
  try { const v = '(' + (results["lower"] ?? 0).toFixed(4) + ', ' + (results["upper"] ?? 0).toFixed(4) + ')'; results["primaryText"] = Number.isFinite(v) ? v : 0; } catch { results["primaryText"] = 0; }
  try { const v = 'Sample Proportion: ' + (results["p"] ?? 0).toFixed(4); results["bd1"] = Number.isFinite(v) ? v : 0; } catch { results["bd1"] = 0; }
  try { const v = 'Margin of Error: +' + (results["me"] ?? 0).toFixed(4); results["bd2"] = Number.isFinite(v) ? v : 0; } catch { results["bd2"] = 0; }
  try { const v = 'Z-value used: ' + input.zValue.toFixed(2); results["bd3"] = Number.isFinite(v) ? v : 0; } catch { results["bd3"] = 0; }
  return results;
}


export function calculateConfidence_interval_for_proportion_calculator(input: Confidence_interval_for_proportion_calculatorInput): Confidence_interval_for_proportion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryText"] ?? 0;
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


export interface Confidence_interval_for_proportion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
