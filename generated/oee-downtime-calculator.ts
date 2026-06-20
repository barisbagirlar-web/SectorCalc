// Auto-generated from oee-downtime-calculator-schema.json
import * as z from 'zod';

export interface Oee_downtime_calculatorInput {
  planned_production_time: number;
  downtime_minutes: number;
  ideal_cycle_time: number;
  total_parts_produced: number;
  defective_parts: number;
  shift_type: string;
  include_micro_stops: boolean;
  dataConfidence?: number;
}

export const Oee_downtime_calculatorInputSchema = z.object({
  planned_production_time: z.number().min(0).max(1440).default(480),
  downtime_minutes: z.number().min(0).max(1440).default(60),
  ideal_cycle_time: z.number().min(0.001).max(100).default(0.5),
  total_parts_produced: z.number().min(0).max(100000).default(800),
  defective_parts: z.number().min(0).max(100000).default(20),
  shift_type: z.enum(['day', 'night', 'rotating']).default('day'),
  include_micro_stops: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Oee_downtime_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.planned_production_time * input.downtime_minutes * input.ideal_cycle_time * input.total_parts_produced; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.planned_production_time * input.downtime_minutes * input.ideal_cycle_time * input.total_parts_produced * (input.defective_parts); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.defective_parts; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateOee_downtime_calculator(input: Oee_downtime_calculatorInput): Oee_downtime_calculatorOutput {
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-plant comparison","Historical data storage"],
  };
}


export interface Oee_downtime_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Oee_downtime_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

