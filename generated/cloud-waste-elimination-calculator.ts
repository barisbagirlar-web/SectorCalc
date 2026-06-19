// Auto-generated from cloud-waste-elimination-calculator-schema.json
import * as z from 'zod';

export interface Cloud_waste_elimination_calculatorInput {
  total_cloud_spend: number;
  compute_utilization_rate: number;
  storage_waste_percentage: number;
  idle_resource_count: number;
  data_transfer_out_gb: number;
  reserved_instance_coverage: number;
  rightsizing_opportunity_score: number;
  cloud_provider: string;
  dataConfidence?: number;
}

export const Cloud_waste_elimination_calculatorInputSchema = z.object({
  total_cloud_spend: z.number().min(0).max(10000000).default(100000),
  compute_utilization_rate: z.number().min(0).max(100).default(45),
  storage_waste_percentage: z.number().min(0).max(100).default(20),
  idle_resource_count: z.number().min(0).max(1000).default(15),
  data_transfer_out_gb: z.number().min(0).max(1000000).default(5000),
  reserved_instance_coverage: z.number().min(0).max(100).default(30),
  rightsizing_opportunity_score: z.number().min(0).max(100).default(60),
  cloud_provider: z.enum(['AWS', 'Azure', 'GCP', 'Other']).default('AWS'),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cloud_waste_elimination_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.idle_resource_count * input.total_cloud_spend; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.idle_resource_count * input.total_cloud_spend * (1 + (input.compute_utilization_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.idle_resource_count * input.total_cloud_spend * (1 + (input.compute_utilization_rate / 100)) * ((input.storage_waste_percentage / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.storage_waste_percentage / 100); results["factor_storage_waste_percentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_storage_waste_percentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCloud_waste_elimination_calculator(input: Cloud_waste_elimination_calculatorInput): Cloud_waste_elimination_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Anomaly detection","Multi-cloud comparison"],
  };
}


export interface Cloud_waste_elimination_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
