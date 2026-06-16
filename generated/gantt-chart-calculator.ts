// Auto-generated from gantt-chart-calculator-schema.json
import * as z from 'zod';

export interface Gantt_chart_calculatorInput {
  numTasks: number;
  taskDuration: number;
  overlap: number;
  startDelay: number;
}

export const Gantt_chart_calculatorInputSchema = z.object({
  numTasks: z.number().default(5),
  taskDuration: z.number().default(5),
  overlap: z.number().default(20),
  startDelay: z.number().default(0),
});

function evaluateAllFormulas(input: Gantt_chart_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.startDelay + input.numTasks * input.taskDuration - (input.numTasks - 1) * input.taskDuration * (input.overlap / 100); results["totalDuration"] = Number.isFinite(v) ? v : 0; } catch { results["totalDuration"] = 0; }
  try { const v = input.numTasks * input.taskDuration; results["totalWork"] = Number.isFinite(v) ? v : 0; } catch { results["totalWork"] = 0; }
  try { const v = (input.numTasks - 1) * input.taskDuration * (input.overlap / 100); results["overlapTime"] = Number.isFinite(v) ? v : 0; } catch { results["overlapTime"] = 0; }
  return results;
}


export function calculateGantt_chart_calculator(input: Gantt_chart_calculatorInput): Gantt_chart_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDuration"] ?? 0;
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


export interface Gantt_chart_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
