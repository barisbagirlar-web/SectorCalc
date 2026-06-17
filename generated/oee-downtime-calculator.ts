// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Oee_downtime_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.planned_production_time + input.downtime_minutes + input.ideal_cycle_time; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.planned_production_time + input.downtime_minutes + input.ideal_cycle_time; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOee_downtime_calculator(input: Oee_downtime_calculatorInput): Oee_downtime_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-plant comparison","Historical data storage"],
  };
}


export interface Oee_downtime_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
