// Auto-generated from box-plot-calculator-schema.json
import * as z from 'zod';

export interface Box_plot_calculatorInput {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export const Box_plot_calculatorInputSchema = z.object({
  min: z.number().default(0),
  q1: z.number().default(25),
  median: z.number().default(50),
  q3: z.number().default(75),
  max: z.number().default(100),
});

function evaluateAllFormulas(input: Box_plot_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.q3 - input.q1; results["iqr"] = Number.isFinite(v) ? v : 0; } catch { results["iqr"] = 0; }
  try { const v = input.q1 - 1.5 * (input.q3 - input.q1); results["lowerFence"] = Number.isFinite(v) ? v : 0; } catch { results["lowerFence"] = 0; }
  try { const v = input.q3 + 1.5 * (input.q3 - input.q1); results["upperFence"] = Number.isFinite(v) ? v : 0; } catch { results["upperFence"] = 0; }
  try { const v = input.min < (input.q1 - 1.5 * (input.q3 - input.q1)); results["minOutlier"] = Number.isFinite(v) ? v : 0; } catch { results["minOutlier"] = 0; }
  try { const v = input.max > (input.q3 + 1.5 * (input.q3 - input.q1)); results["maxOutlier"] = Number.isFinite(v) ? v : 0; } catch { results["maxOutlier"] = 0; }
  return results;
}


export function calculateBox_plot_calculator(input: Box_plot_calculatorInput): Box_plot_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["q3"] ?? 0;
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


export interface Box_plot_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
