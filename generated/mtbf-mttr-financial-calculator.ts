// @ts-nocheck
// Auto-generated from mtbf-mttr-financial-calculator-schema.json
import * as z from 'zod';

export interface Mtbf_mttr_financial_calculatorInput {
  operating_hours_per_year: number;
  number_of_units: number;
  mtbf: number;
  mttr: number;
  cost_per_downtime_hour: number;
  cost_per_failure_event: number;
  maintenance_labor_rate: number;
  reliability_improvement_investment: number;
}

export const Mtbf_mttr_financial_calculatorInputSchema = z.object({
  operating_hours_per_year: z.number().min(1).max(8760).default(8760),
  number_of_units: z.number().min(1).max(10000).default(10),
  mtbf: z.number().min(1).max(100000).default(500),
  mttr: z.number().min(0.1).max(1000).default(4),
  cost_per_downtime_hour: z.number().min(0).max(1000000).default(1000),
  cost_per_failure_event: z.number().min(0).max(100000).default(500),
  maintenance_labor_rate: z.number().min(0).max(500).default(75),
  reliability_improvement_investment: z.number().min(0).max(10000000).default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mtbf_mttr_financial_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.operating_hours_per_year + input.number_of_units + input.mtbf; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.operating_hours_per_year + input.number_of_units + input.mtbf; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMtbf_mttr_financial_calculator(input: Mtbf_mttr_financial_calculatorInput): Mtbf_mttr_financial_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Benchmarking against industry standards"],
  };
}


export interface Mtbf_mttr_financial_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
