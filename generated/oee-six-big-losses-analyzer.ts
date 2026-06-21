// Auto-generated from oee-six-big-losses-analyzer-schema.json
import * as z from 'zod';

export interface Oee_six_big_losses_analyzerInput {
  plannedTime: number;
  downtime: number;
  idealCycleTime: number;
  totalCount: number;
  goodCount: number;
  allTime: number;
  breakdownCount: number;
  operatingTime: number;
  setupLoss: number;
  breakdownLoss: number;
  speedLoss: number;
  minorStopLoss: number;
  defectLoss: number;
  yieldLoss: number;
  dataConfidence?: number;
}

export const Oee_six_big_losses_analyzerInputSchema = z.object({
  plannedTime: z.number().min(0).default(0),
  downtime: z.number().min(0).default(0),
  idealCycleTime: z.number().min(0).default(0),
  totalCount: z.number().min(0).default(0),
  goodCount: z.number().min(0).default(0),
  allTime: z.number().min(0).default(0),
  breakdownCount: z.number().min(0).default(0),
  operatingTime: z.number().min(0).default(0),
  setupLoss: z.number().min(0).default(0),
  breakdownLoss: z.number().min(0).default(0),
  speedLoss: z.number().min(0).default(0),
  minorStopLoss: z.number().min(0).default(0),
  defectLoss: z.number().min(0).default(0),
  yieldLoss: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Oee_six_big_losses_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.plannedTime * input.downtime * input.idealCycleTime * input.totalCount; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.plannedTime * input.downtime * input.idealCycleTime * input.totalCount * (input.goodCount * input.allTime * input.breakdownCount * input.operatingTime * input.setupLoss * input.breakdownLoss * input.speedLoss * input.minorStopLoss * input.defectLoss * input.yieldLoss); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.goodCount * input.allTime * input.breakdownCount * input.operatingTime * input.setupLoss * input.breakdownLoss * input.speedLoss * input.minorStopLoss * input.defectLoss * input.yieldLoss; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateOee_six_big_losses_analyzer(input: Oee_six_big_losses_analyzerInput): Oee_six_big_losses_analyzerOutput {
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


export interface Oee_six_big_losses_analyzerOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Oee_six_big_losses_analyzerOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

