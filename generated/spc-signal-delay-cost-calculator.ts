// Auto-generated from spc-signal-delay-cost-calculator-schema.json
import * as z from 'zod';

export interface Spc_signal_delay_cost_calculatorInput {
  process_cycle_time_min: number;
  units_per_cycle: number;
  defect_rate_out_of_control: number;
  defect_rate_in_control: number;
  cost_per_defect: number;
  detection_delay_hours: number;
  response_delay_hours: number;
  shift_hours: number;
  dataConfidence?: number;
}

export const Spc_signal_delay_cost_calculatorInputSchema = z.object({
  process_cycle_time_min: z.number().min(1).max(1440).default(60),
  units_per_cycle: z.number().min(1).max(100000).default(100),
  defect_rate_out_of_control: z.number().min(0.1).max(100).default(5),
  defect_rate_in_control: z.number().min(0).max(100).default(0.5),
  cost_per_defect: z.number().min(0.01).max(100000).default(50),
  detection_delay_hours: z.number().min(0).max(720).default(4),
  response_delay_hours: z.number().min(0).max(720).default(2),
  shift_hours: z.number().min(1).max(24).default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spc_signal_delay_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.units_per_cycle * input.cost_per_defect; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.units_per_cycle * input.cost_per_defect * (1 + (input.defect_rate_out_of_control / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.units_per_cycle * input.cost_per_defect * (1 + (input.defect_rate_out_of_control / 100)) * (input.process_cycle_time_min); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.process_cycle_time_min; results["factor_process_cycle_time_min"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_process_cycle_time_min"] = Number.NaN; }
  return results;
}


export function calculateSpc_signal_delay_cost_calculator(input: Spc_signal_delay_cost_calculatorInput): Spc_signal_delay_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_process_cycle_time_min: toNumericFormulaValue(values["factor_process_cycle_time_min"])
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-plant comparison"],
  };
}


export interface Spc_signal_delay_cost_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_process_cycle_time_min: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Spc_signal_delay_cost_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_process_cycle_time_min"],
} as const;

