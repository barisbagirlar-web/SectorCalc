// Auto-generated from gantt-chart-calculator-schema.json
import * as z from 'zod';

export interface Gantt_chart_calculatorInput {
  numTasks: number;
  taskDuration: number;
  overlap: number;
  startDelay: number;
  dataConfidence?: number;
}

export const Gantt_chart_calculatorInputSchema = z.object({
  numTasks: z.number().default(5),
  taskDuration: z.number().default(5),
  overlap: z.number().default(20),
  startDelay: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gantt_chart_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.startDelay + input.numTasks * input.taskDuration - (input.numTasks - 1) * input.taskDuration * (input.overlap / 100); results["totalDuration"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDuration"] = 0; }
  try { const v = input.numTasks * input.taskDuration; results["totalWork"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWork"] = 0; }
  try { const v = (input.numTasks - 1) * input.taskDuration * (input.overlap / 100); results["overlapTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overlapTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGantt_chart_calculator(input: Gantt_chart_calculatorInput): Gantt_chart_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDuration"]);
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


export interface Gantt_chart_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
