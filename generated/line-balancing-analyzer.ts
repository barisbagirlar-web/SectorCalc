// Auto-generated from line-balancing-analyzer-schema.json
import * as z from 'zod';

export interface Line_balancing_analyzerInput {
  taskTimes: number;
  availableTime: number;
  demand: number;
  actualWorkstations: number;
  maxStationTime: number;
  stationTimes: number;
  dataConfidence?: number;
}

export const Line_balancing_analyzerInputSchema = z.object({
  taskTimes: z.number().min(0).default(0),
  availableTime: z.number().min(0).default(0),
  demand: z.number().min(0).default(0),
  actualWorkstations: z.number().min(0).default(0),
  maxStationTime: z.number().min(0).default(0),
  stationTimes: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Line_balancing_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.taskTimes * input.availableTime * input.demand * input.actualWorkstations; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.taskTimes * input.availableTime * input.demand * input.actualWorkstations * (input.maxStationTime * input.stationTimes); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.maxStationTime * input.stationTimes; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateLine_balancing_analyzer(input: Line_balancing_analyzerInput): Line_balancing_analyzerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Line_balancing_analyzerOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Line_balancing_analyzerOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

