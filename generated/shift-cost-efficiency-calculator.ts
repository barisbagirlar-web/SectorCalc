// @ts-nocheck
// Auto-generated from shift-cost-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Shift_cost_efficiency_calculatorInput {
  shift_duration_hours: number;
  total_units_produced: number;
  defective_units: number;
  rework_units: number;
  labor_cost_per_hour: number;
  number_of_operators: number;
  material_cost_per_unit: number;
  energy_cost_per_shift: number;
}

export const Shift_cost_efficiency_calculatorInputSchema = z.object({
  shift_duration_hours: z.number().min(1).max(24).default(8),
  total_units_produced: z.number().min(0).max(100000).default(1000),
  defective_units: z.number().min(0).max(100000).default(50),
  rework_units: z.number().min(0).max(100000).default(30),
  labor_cost_per_hour: z.number().min(0).max(200).default(25),
  number_of_operators: z.number().min(1).max(100).default(10),
  material_cost_per_unit: z.number().min(0).max(1000).default(2.5),
  energy_cost_per_shift: z.number().min(0).max(100000).default(500),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Shift_cost_efficiency_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.shift_duration_hours + input.total_units_produced + input.defective_units; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.shift_duration_hours + input.total_units_produced + input.defective_units; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateShift_cost_efficiency_calculator(input: Shift_cost_efficiency_calculatorInput): Shift_cost_efficiency_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-shift comparison","Real-time OEE integration"],
  };
}


export interface Shift_cost_efficiency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
