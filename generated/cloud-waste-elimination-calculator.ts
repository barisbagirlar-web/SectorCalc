// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cloud_waste_elimination_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.total_cloud_spend + input.compute_utilization_rate + input.storage_waste_percentage; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.total_cloud_spend + input.compute_utilization_rate + input.storage_waste_percentage; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCloud_waste_elimination_calculator(input: Cloud_waste_elimination_calculatorInput): Cloud_waste_elimination_calculatorOutput {
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
