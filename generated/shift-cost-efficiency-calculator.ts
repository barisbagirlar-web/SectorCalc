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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Shift_cost_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shift_duration_hours; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.number_of_operators * 1 * input.shift_duration_hours * input.material_cost_per_unit; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.number_of_operators * 1 * input.shift_duration_hours * input.material_cost_per_unit * input.total_units_produced; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateShift_cost_efficiency_calculator(input: Shift_cost_efficiency_calculatorInput): Shift_cost_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
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
