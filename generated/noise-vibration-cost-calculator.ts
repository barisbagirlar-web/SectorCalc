// Auto-generated from noise-vibration-cost-calculator-schema.json
import * as z from 'zod';

export interface Noise_vibration_cost_calculatorInput {
  num_workers_exposed: number;
  avg_daily_exposure_hours: number;
  noise_level_dba: number;
  vibration_level_ms2: number;
  machine_runtime_hours_per_day: number;
  maintenance_cost_per_machine_per_year: number;
  number_of_machines: number;
  avg_worker_annual_salary: number;
  dataConfidence?: number;
}

export const Noise_vibration_cost_calculatorInputSchema = z.object({
  num_workers_exposed: z.number().min(1).max(10000).default(10),
  avg_daily_exposure_hours: z.number().min(0.5).max(16).default(8),
  noise_level_dba: z.number().min(60).max(130).default(85),
  vibration_level_ms2: z.number().min(0.1).max(20).default(0.5),
  machine_runtime_hours_per_day: z.number().min(1).max(24).default(16),
  maintenance_cost_per_machine_per_year: z.number().min(0).max(1000000).default(5000),
  number_of_machines: z.number().min(1).max(500).default(5),
  avg_worker_annual_salary: z.number().min(15000).max(200000).default(45000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Noise_vibration_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avg_daily_exposure_hours; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.num_workers_exposed * 1 * input.avg_daily_exposure_hours * input.avg_worker_annual_salary; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = (input.num_workers_exposed * 1 * input.avg_daily_exposure_hours * input.avg_worker_annual_salary) + (input.number_of_machines * input.maintenance_cost_per_machine_per_year); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.number_of_machines * input.maintenance_cost_per_machine_per_year; results["machine_maintenance_annual"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["machine_maintenance_annual"] = 0; }
  try { const v = input.number_of_machines * input.avg_daily_exposure_hours; results["machine_runtime_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["machine_runtime_hours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNoise_vibration_cost_calculator(input: Noise_vibration_cost_calculatorInput): Noise_vibration_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Custom threshold configuration"],
  };
}


export interface Noise_vibration_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
