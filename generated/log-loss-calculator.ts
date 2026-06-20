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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Log_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.actual1 * input.predicted1 * input.actual2 * input.predicted2; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.actual1 * input.predicted1 * input.actual2 * input.predicted2 * (input.actual3 * input.predicted3 * input.actual4 * input.predicted4); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.actual3 * input.predicted3 * input.actual4 * input.predicted4; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateLog_loss_calculator(input: Log_loss_calculatorInput): Log_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Log_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
