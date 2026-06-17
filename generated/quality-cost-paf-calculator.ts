// @ts-nocheck
// Auto-generated from quality-cost-paf-calculator-schema.json
import * as z from 'zod';

export interface Quality_cost_paf_calculatorInput {
  total_sales: number;
  prevention_training_cost: number;
  prevention_design_cost: number;
  appraisal_inspection_cost: number;
  appraisal_audit_cost: number;
  internal_failure_scrap_cost: number;
  internal_failure_downtime_cost: number;
  external_failure_warranty_cost: number;
}

export const Quality_cost_paf_calculatorInputSchema = z.object({
  total_sales: z.number().min(0).max(1000000000).default(1000000),
  prevention_training_cost: z.number().min(0).max(500000).default(15000),
  prevention_design_cost: z.number().min(0).max(500000).default(25000),
  appraisal_inspection_cost: z.number().min(0).max(500000).default(40000),
  appraisal_audit_cost: z.number().min(0).max(200000).default(10000),
  internal_failure_scrap_cost: z.number().min(0).max(1000000).default(60000),
  internal_failure_downtime_cost: z.number().min(0).max(500000).default(20000),
  external_failure_warranty_cost: z.number().min(0).max(1000000).default(80000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Quality_cost_paf_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.total_sales + input.prevention_training_cost + input.prevention_design_cost; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.total_sales + input.prevention_training_cost + input.prevention_design_cost; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateQuality_cost_paf_calculator(input: Quality_cost_paf_calculatorInput): Quality_cost_paf_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-plant comparison","Real-time dashboard"],
  };
}


export interface Quality_cost_paf_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
