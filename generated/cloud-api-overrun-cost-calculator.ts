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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cloud_api_overrun_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.api_call_volume * input.cost_per_call; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.api_call_volume * input.cost_per_call * (1 + (input.overrun_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.api_call_volume * input.cost_per_call * (1 + (input.overrun_rate / 100)) * (input.avg_overrun_duration); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.avg_overrun_duration; results["factor_avg_overrun_duration"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_avg_overrun_duration"] = Number.NaN; }
  return results;
}


export function calculateCloud_api_overrun_cost_calculator(input: Cloud_api_overrun_cost_calculatorInput): Cloud_api_overrun_cost_calculatorOutput {
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
