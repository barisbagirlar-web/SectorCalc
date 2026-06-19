// Auto-generated from overtime-vs-hiring-breakeven-calculator-schema.json
import * as z from 'zod';

export interface Overtime_vs_hiring_breakeven_calculatorInput {
  current_headcount: number;
  avg_hourly_wage: number;
  overtime_premium: number;
  overtime_hours_per_week: number;
  hiring_cost_per_fte: number;
  annual_benefits_cost_per_fte: number;
  productivity_factor_overtime: number;
  productivity_factor_new_hire: number;
  dataConfidence?: number;
}

export const Overtime_vs_hiring_breakeven_calculatorInputSchema = z.object({
  current_headcount: z.number().min(1).max(10000).default(50),
  avg_hourly_wage: z.number().min(7.25).max(200).default(25),
  overtime_premium: z.number().min(1).max(3).default(1.5),
  overtime_hours_per_week: z.number().min(0).max(60).default(10),
  hiring_cost_per_fte: z.number().min(0).max(100000).default(5000),
  annual_benefits_cost_per_fte: z.number().min(0).max(100000).default(12000),
  productivity_factor_overtime: z.number().min(50).max(100).default(85),
  productivity_factor_new_hire: z.number().min(10).max(100).default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Overtime_vs_hiring_breakeven_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avg_hourly_wage; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.current_headcount * 1 * input.avg_hourly_wage * input.avg_hourly_wage; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.current_headcount * 1 * input.avg_hourly_wage * input.avg_hourly_wage * input.productivity_factor_new_hire * (input.overtime_premium); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.overtime_premium; results["factor_overtime_premium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_overtime_premium"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOvertime_vs_hiring_breakeven_calculator(input: Overtime_vs_hiring_breakeven_calculatorInput): Overtime_vs_hiring_breakeven_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario simulation","Multi-site comparison"],
  };
}


export interface Overtime_vs_hiring_breakeven_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
