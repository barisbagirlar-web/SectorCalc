// @ts-nocheck
// Auto-generated from rca-recurring-cost-calculator-schema.json
import * as z from 'zod';

export interface Rca_recurring_cost_calculatorInput {
  labor_rate: number;
  labor_hours_per_cycle: number;
  material_cost_per_unit: number;
  energy_cost_per_cycle: number;
  maintenance_cost_per_cycle: number;
  overhead_rate: number;
  cycle_time_minutes: number;
  defect_rate: number;
}

export const Rca_recurring_cost_calculatorInputSchema = z.object({
  labor_rate: z.number().min(7.25).max(150).default(25),
  labor_hours_per_cycle: z.number().min(0.01).max(8).default(0.5),
  material_cost_per_unit: z.number().min(0).max(10000).default(12),
  energy_cost_per_cycle: z.number().min(0).max(500).default(1.5),
  maintenance_cost_per_cycle: z.number().min(0).max(200).default(0.75),
  overhead_rate: z.number().min(0).max(100).default(20),
  cycle_time_minutes: z.number().min(0.1).max(480).default(30),
  defect_rate: z.number().min(0).max(100).default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rca_recurring_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.labor_rate / 100) * input.labor_hours_per_cycle * input.material_cost_per_unit * input.energy_cost_per_cycle; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = (input.labor_rate / 100) * input.labor_hours_per_cycle * input.material_cost_per_unit * input.energy_cost_per_cycle * (input.maintenance_cost_per_cycle * (input.overhead_rate / 100) * input.cycle_time_minutes * (input.defect_rate / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.maintenance_cost_per_cycle * (input.overhead_rate / 100) * input.cycle_time_minutes * (input.defect_rate / 100); results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRca_recurring_cost_calculator(input: Rca_recurring_cost_calculatorInput): Rca_recurring_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated report generation"],
  };
}


export interface Rca_recurring_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
