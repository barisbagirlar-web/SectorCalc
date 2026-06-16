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
  external_failure_liability_cost: number;
  quality_improvement_investment: number;
  industry_type: string;
  include_hidden_drivers: boolean;
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
  external_failure_liability_cost: z.number().min(0).max(500000).default(30000),
  quality_improvement_investment: z.number().min(0).max(500000).default(0),
  industry_type: z.enum(['Automotive', 'Aerospace', 'Electronics', 'Pharmaceutical', 'Food & Beverage', 'General Manufacturing', 'Other']).default('General Manufacturing'),
  include_hidden_drivers: z.boolean().default(true),
});

function evaluateAllFormulas(input: Quality_cost_paf_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["total_prevention_cost"] = input.prevention_training_cost + input.prevention_design_cost + input.quality_improvement_investment; } catch { results["total_prevention_cost"] = 0; }
  try { results["total_appraisal_cost"] = input.appraisal_inspection_cost + input.appraisal_audit_cost; } catch { results["total_appraisal_cost"] = 0; }
  try { results["total_internal_failure_cost"] = input.internal_failure_scrap_cost + input.internal_failure_downtime_cost; } catch { results["total_internal_failure_cost"] = 0; }
  try { results["total_external_failure_cost"] = input.external_failure_warranty_cost + input.external_failure_liability_cost; } catch { results["total_external_failure_cost"] = 0; }
  try { results["total_failure_cost"] = (results["total_internal_failure_cost"] ?? 0) + (results["total_external_failure_cost"] ?? 0); } catch { results["total_failure_cost"] = 0; }
  try { results["total_quality_cost"] = (results["total_prevention_cost"] ?? 0) + (results["total_appraisal_cost"] ?? 0) + (results["total_failure_cost"] ?? 0); } catch { results["total_quality_cost"] = 0; }
  try { results["quality_cost_ratio"] = ((results["total_quality_cost"] ?? 0) / input.total_sales) * 100; } catch { results["quality_cost_ratio"] = 0; }
  try { results["prevention_cost_ratio"] = ((results["total_prevention_cost"] ?? 0) / input.total_sales) * 100; } catch { results["prevention_cost_ratio"] = 0; }
  try { results["appraisal_cost_ratio"] = ((results["total_appraisal_cost"] ?? 0) / input.total_sales) * 100; } catch { results["appraisal_cost_ratio"] = 0; }
  try { results["failure_cost_ratio"] = ((results["total_failure_cost"] ?? 0) / input.total_sales) * 100; } catch { results["failure_cost_ratio"] = 0; }
  try { results["cost_of_poor_quality"] = (results["total_failure_cost"] ?? 0) + (results["total_appraisal_cost"] ?? 0) * 0.5; } catch { results["cost_of_poor_quality"] = 0; }
  try { results["hidden_loss_drivers_score"] = ((input.include_hidden_drivers) ? (((results["total_failure_cost"] ?? 0) * 0.2) + ((results["total_appraisal_cost"] ?? 0) * 0.1)) : (0)); } catch { results["hidden_loss_drivers_score"] = 0; }
  return results;
}


export function calculateQuality_cost_paf_calculator(input: Quality_cost_paf_calculatorInput): Quality_cost_paf_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_quality_cost"] ?? 0;
  const breakdown = {
    prevention_cost: values["prevention_cost"] ?? 0,
    appraisal_cost: values["appraisal_cost"] ?? 0,
    internal_failure_cost: values["internal_failure_cost"] ?? 0,
    external_failure_cost: values["external_failure_cost"] ?? 0,
    cost_of_poor_quality: values["cost_of_poor_quality"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Lost Customer Goodwill","Overtime & Expediting","Excess Inventory (Safety Stock)"];
  const suggestedActions: string[] = ["Increase Prevention Investment","Optimize Appraisal Activities","Launch Six Sigma DMAIC Project","Improve Supplier Quality"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
  breakdown: { prevention_cost: number; appraisal_cost: number; internal_failure_cost: number; external_failure_cost: number; cost_of_poor_quality: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
