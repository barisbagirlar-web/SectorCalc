// @ts-nocheck
// Auto-generated from haccp-deviation-cost-calculator-schema.json
import * as z from 'zod';

export interface Haccp_deviation_cost_calculatorInput {
  deviation_type: string;
  affected_batch_kg: number;
  unit_cost_per_kg: number;
  rework_percentage: number;
  rework_cost_per_kg: number;
  downtime_hours: number;
  hourly_overhead_rate: number;
  regulatory_penalty_flag: boolean;
}

export const Haccp_deviation_cost_calculatorInputSchema = z.object({
  deviation_type: z.enum(['temperature', 'time', 'cross_contamination', 'chemical', 'allergen', 'other']).default('temperature'),
  affected_batch_kg: z.number().min(0).max(100000).default(1000),
  unit_cost_per_kg: z.number().min(0).max(1000).default(5),
  rework_percentage: z.number().min(0).max(100).default(30),
  rework_cost_per_kg: z.number().min(0).max(500).default(2),
  downtime_hours: z.number().min(0).max(168).default(2),
  hourly_overhead_rate: z.number().min(0).max(10000).default(500),
  regulatory_penalty_flag: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Haccp_deviation_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.deviation_type + input.affected_batch_kg + input.unit_cost_per_kg; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.deviation_type + input.affected_batch_kg + input.unit_cost_per_kg; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHaccp_deviation_cost_calculator(input: Haccp_deviation_cost_calculatorInput): Haccp_deviation_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Automated CAPA generation"],
  };
}


export interface Haccp_deviation_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
