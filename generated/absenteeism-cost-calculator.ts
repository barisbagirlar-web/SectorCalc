// Auto-generated from absenteeism-cost-calculator-schema.json
import * as z from 'zod';

export interface Absenteeism_cost_calculatorInput {
  total_employees: number;
  absenteeism_rate: number;
  avg_hourly_wage: number;
  avg_hours_per_day: number;
  working_days_per_year: number;
  replacement_cost_per_hour: number;
  overhead_multiplier: number;
  industry_type: string;
  dataConfidence?: number;
}

export const Absenteeism_cost_calculatorInputSchema = z.object({
  total_employees: z.number().min(1).max(100000).default(500),
  absenteeism_rate: z.number().min(0).max(100).default(3.5),
  avg_hourly_wage: z.number().min(7.25).max(200).default(25),
  avg_hours_per_day: z.number().min(1).max(16).default(8),
  working_days_per_year: z.number().min(1).max(365).default(250),
  replacement_cost_per_hour: z.number().min(0).max(500).default(35),
  overhead_multiplier: z.number().min(1).max(5).default(1.3),
  industry_type: z.enum(['Manufacturing', 'Healthcare', 'Retail', 'Logistics', 'Professional Services', 'Construction']).default('Manufacturing'),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Absenteeism_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_employees * (input.absenteeism_rate / 100) * input.avg_hours_per_day * input.working_days_per_year; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.total_employees * (input.absenteeism_rate / 100) * (input.avg_hourly_wage * input.working_days_per_year) * input.avg_hourly_wage; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.total_employees * (input.absenteeism_rate / 100) * (input.avg_hourly_wage * input.working_days_per_year) * input.avg_hourly_wage * input.overhead_multiplier; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAbsenteeism_cost_calculator(input: Absenteeism_cost_calculatorInput): Absenteeism_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Automated alerts via email"],
  };
}


export interface Absenteeism_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
