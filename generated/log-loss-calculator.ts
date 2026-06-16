// Auto-generated from log-loss-calculator-schema.json
import * as z from 'zod';

export interface Log_loss_calculatorInput {
  actual1: number;
  predicted1: number;
  actual2: number;
  predicted2: number;
  actual3: number;
  predicted3: number;
  actual4: number;
  predicted4: number;
}

export const Log_loss_calculatorInputSchema = z.object({
  actual1: z.number().default(0),
  predicted1: z.number().default(0.5),
  actual2: z.number().default(0),
  predicted2: z.number().default(0.5),
  actual3: z.number().default(0),
  predicted3: z.number().default(0.5),
  actual4: z.number().default(0),
  predicted4: z.number().default(0.5),
});

function evaluateAllFormulas(input: Log_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (-(input.actual1 * Math.log(Math.max(input.predicted1, 1e-15)) + (1-input.actual1) * Math.log(Math.max(1-input.predicted1, 1e-15)))) + (-(input.actual2 * Math.log(Math.max(input.predicted2, 1e-15)) + (1-input.actual2) * Math.log(Math.max(1-input.predicted2, 1e-15)))) + (-(input.actual3 * Math.log(Math.max(input.predicted3, 1e-15)) + (1-input.actual3) * Math.log(Math.max(1-input.predicted3, 1e-15)))) + (-(input.actual4 * Math.log(Math.max(input.predicted4, 1e-15)) + (1-input.actual4) * Math.log(Math.max(1-input.predicted4, 1e-15)))); results["totalLogLossSum"] = Number.isFinite(v) ? v : 0; } catch { results["totalLogLossSum"] = 0; }
  try { const v = (results["totalLogLossSum"] ?? 0) / 4; results["averageLogLoss"] = Number.isFinite(v) ? v : 0; } catch { results["averageLogLoss"] = 0; }
  try { const v = 4; results["sampleCount"] = Number.isFinite(v) ? v : 0; } catch { results["sampleCount"] = 0; }
  return results;
}


export function calculateLog_loss_calculator(input: Log_loss_calculatorInput): Log_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["averageLogLoss"] ?? 0;
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


export interface Log_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
