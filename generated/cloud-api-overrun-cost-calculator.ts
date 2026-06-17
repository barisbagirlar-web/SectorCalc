// @ts-nocheck
// Auto-generated from cloud-api-overrun-cost-calculator-schema.json
import * as z from 'zod';

export interface Cloud_api_overrun_cost_calculatorInput {
  api_call_volume: number;
  overrun_rate: number;
  avg_overrun_duration: number;
  cost_per_call: number;
  retry_cost_per_call: number;
  retry_rate: number;
  data_egress_gb: number;
  egress_cost_per_gb: number;
}

export const Cloud_api_overrun_cost_calculatorInputSchema = z.object({
  api_call_volume: z.number().min(1000).max(1000000000).default(1000000),
  overrun_rate: z.number().min(0).max(100).default(5),
  avg_overrun_duration: z.number().min(1).max(30000).default(500),
  cost_per_call: z.number().min(0.00001).max(1).default(0.0002),
  retry_cost_per_call: z.number().min(0.00001).max(2).default(0.0005),
  retry_rate: z.number().min(0).max(100).default(10),
  data_egress_gb: z.number().min(0).max(1000000).default(500),
  egress_cost_per_gb: z.number().min(0.01).max(0.5).default(0.09),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cloud_api_overrun_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.api_call_volume + input.overrun_rate + input.avg_overrun_duration; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.api_call_volume + input.overrun_rate + input.avg_overrun_duration; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCloud_api_overrun_cost_calculator(input: Cloud_api_overrun_cost_calculatorInput): Cloud_api_overrun_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-region comparison","Automated SLA compliance report"],
  };
}


export interface Cloud_api_overrun_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
