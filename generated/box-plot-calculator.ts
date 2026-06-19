// Auto-generated from box-plot-calculator-schema.json
import * as z from 'zod';

export interface Box_plot_calculatorInput {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  dataConfidence?: number;
}

export const Box_plot_calculatorInputSchema = z.object({
  min: z.number().default(0),
  q1: z.number().default(25),
  median: z.number().default(50),
  q3: z.number().default(75),
  max: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Box_plot_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.q3 - input.q1; results["iqr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["iqr"] = 0; }
  try { const v = input.q1 - 1.5 * (input.q3 - input.q1); results["lowerFence"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lowerFence"] = 0; }
  try { const v = input.q3 + 1.5 * (input.q3 - input.q1); results["upperFence"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["upperFence"] = 0; }
  try { const v = input.min < (input.q1 - 1.5 * (input.q3 - input.q1)); results["minOutlier"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["minOutlier"] = 0; }
  try { const v = input.max > (input.q3 + 1.5 * (input.q3 - input.q1)); results["maxOutlier"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxOutlier"] = 0; }
  try { const v = input.q1 - 1.5 * (input.q3 - input.q1); results["q1___1_5____q3___q1_"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["q1___1_5____q3___q1_"] = 0; }
  try { const v = input.q3 + 1.5 * (input.q3 - input.q1); results["q3___1_5____q3___q1_"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["q3___1_5____q3___q1_"] = 0; }
  try { const v = input.min < (input.q1 - 1.5 * (input.q3 - input.q1)); results["min____q1___1_5____q3___q1__"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["min____q1___1_5____q3___q1__"] = 0; }
  try { const v = input.max > (input.q3 + 1.5 * (input.q3 - input.q1)); results["max____q3___1_5____q3___q1__"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["max____q3___1_5____q3___q1__"] = 0; }
  try { const v = input.q3 - input.q1; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBox_plot_calculator(input: Box_plot_calculatorInput): Box_plot_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
