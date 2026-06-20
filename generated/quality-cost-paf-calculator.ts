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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Quality_cost_paf_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.prevention_training_cost + input.prevention_design_cost; results["total_prevention_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_prevention_cost"] = Number.NaN; }
  try { const v = input.appraisal_inspection_cost + input.appraisal_audit_cost; results["total_appraisal_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_appraisal_cost"] = Number.NaN; }
  try { const v = input.internal_failure_scrap_cost + input.internal_failure_downtime_cost + input.external_failure_warranty_cost; results["total_failure_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_failure_cost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_prevention_cost"])) + (toNumericFormulaValue(results["total_appraisal_cost"])) + (toNumericFormulaValue(results["total_failure_cost"])); results["total_quality_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_quality_cost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_quality_cost"])) / input.total_sales * 100; results["coq_ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["coq_ratio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_quality_cost"])); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateQuality_cost_paf_calculator(input: Quality_cost_paf_calculatorInput): Quality_cost_paf_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["External failure costs (warranty/returns) often exceed captured costs","Prevention under-investment leads to exponential appraisal/failure costs"];
  const suggestedActions: string[] = ["Increase prevention budget to reduce failure costs (1:10 leverage)","Track CoQ ratio monthly, target <15% of sales"];
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
