// Auto-generated from percentile-calculator-schema.json
import * as z from 'zod';

export interface Percentile_calculatorInput {
  data1: number;
  data2: number;
  data3: number;
  data4: number;
  data5: number;
  percentile: number;
}

export const Percentile_calculatorInputSchema = z.object({
  data1: z.number().default(0),
  data2: z.number().default(0),
  data3: z.number().default(0),
  data4: z.number().default(0),
  data5: z.number().default(0),
  percentile: z.number().default(50),
});

function evaluateAllFormulas(input: Percentile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { JSON.stringify([input.data1, input.data2, input.data3, input.data4, input.data5].sort(function(a, b) { return a - b; })) })(); results["sortedDataStr"] = Number.isFinite(v) ? v : 0; } catch { results["sortedDataStr"] = 0; }
  try { const v = (input.percentile / 100) * 6; results["rankValue"] = Number.isFinite(v) ? v : 0; } catch { results["rankValue"] = 0; }
  try { const v = (function() { var sorted = [data1, data2, data3, data4, data5].sort(function(a, b) { return a - b; }); var n = 5; var index = (percentile / 100) * (n + 1); var k = Math.floor(index); if (k === 0) return sorted[0]; if (k >= n) return sorted[n - 1]; return sorted[k - 1]; })(); results["lowerValue"] = Number.isFinite(v) ? v : 0; } catch { results["lowerValue"] = 0; }
  try { const v = (function() { var sorted = [data1, data2, data3, data4, data5].sort(function(a, b) { return a - b; }); var n = 5; var index = (percentile / 100) * (n + 1); var k = Math.ceil(index); if (k <= 1) return sorted[0]; if (k >= n) return sorted[n - 1]; return sorted[k - 1]; })(); results["upperValue"] = Number.isFinite(v) ? v : 0; } catch { results["upperValue"] = 0; }
  try { const v = (function() { var sorted = [data1, data2, data3, data4, data5].sort(function(a, b) { return a - b; }); var n = 5; var p = percentile / 100; var index = p * (n + 1); var k = Math.floor(index); var d = index - k; if (k === 0) return sorted[0]; if (k >= n) return sorted[n - 1]; return sorted[k - 1] + d * (sorted[k] - sorted[k - 1]); })(); results["percentileValue"] = Number.isFinite(v) ? v : 0; } catch { results["percentileValue"] = 0; }
  return results;
}


export function calculatePercentile_calculator(input: Percentile_calculatorInput): Percentile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentileValue"] ?? 0;
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


export interface Percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
