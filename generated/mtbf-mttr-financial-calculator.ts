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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mtbf_mttr_financial_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operating_hours_per_year; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.number_of_units * (input.maintenance_labor_rate / 100) * input.operating_hours_per_year * input.cost_per_failure_event; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.number_of_units * (input.maintenance_labor_rate / 100) * input.operating_hours_per_year * input.cost_per_failure_event * input.reliability_improvement_investment; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMtbf_mttr_financial_calculator(input: Mtbf_mttr_financial_calculatorInput): Mtbf_mttr_financial_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
