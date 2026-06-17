// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Overtime_vs_hiring_breakeven_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.current_headcount + input.avg_hourly_wage + input.overtime_premium; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.current_headcount + input.avg_hourly_wage + input.overtime_premium; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOvertime_vs_hiring_breakeven_calculator(input: Overtime_vs_hiring_breakeven_calculatorInput): Overtime_vs_hiring_breakeven_calculatorOutput {
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
