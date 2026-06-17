// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Noise_vibration_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.num_workers_exposed + input.avg_daily_exposure_hours + input.noise_level_dba; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.num_workers_exposed + input.avg_daily_exposure_hours + input.noise_level_dba; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNoise_vibration_cost_calculator(input: Noise_vibration_cost_calculatorInput): Noise_vibration_cost_calculatorOutput {
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
