// Auto-generated from cloud-api-overrun-cost-schema.json
import * as z from 'zod';

export interface Cloud_api_overrun_costInput {
  api_call_volume: number;
  overrun_rate: number;
  avg_overrun_duration: number;
  cost_per_call: number;
  retry_cost_per_call: number;
  retry_rate: number;
  data_egress_gb: number;
  egress_cost_per_gb: number;
  sla_penalty_percentage: number;
  monthly_service_fee: number;
  overrun_threshold_ms: number;
  region: string;
  include_hidden_costs: boolean;
}

export const Cloud_api_overrun_costInputSchema = z.object({
  api_call_volume: z.number().min(1000).max(1000000000).default(1000000),
  overrun_rate: z.number().min(0).max(100).default(5),
  avg_overrun_duration: z.number().min(1).max(30000).default(500),
  cost_per_call: z.number().min(0.00001).max(1).default(0.0002),
  retry_cost_per_call: z.number().min(0.00001).max(2).default(0.0005),
  retry_rate: z.number().min(0).max(100).default(10),
  data_egress_gb: z.number().min(0).max(1000000).default(500),
  egress_cost_per_gb: z.number().min(0.01).max(0.5).default(0.09),
  sla_penalty_percentage: z.number().min(0).max(100).default(10),
  monthly_service_fee: z.number().min(100).max(1000000).default(5000),
  overrun_threshold_ms: z.number().min(10).max(5000).default(200),
  region: z.enum(['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1']).default('us-east-1'),
  include_hidden_costs: z.boolean().default(true),
});

function evaluateAllFormulas(input: Cloud_api_overrun_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["overrun_call_volume"] = input.api_call_volume * (input.overrun_rate / 100); } catch { results["overrun_call_volume"] = 0; }
  try { results["direct_overrun_cost"] = (results["overrun_call_volume"] ?? 0) * input.cost_per_call; } catch { results["direct_overrun_cost"] = 0; }
  try { results["retry_cost"] = (results["overrun_call_volume"] ?? 0) * (input.retry_rate / 100) * input.retry_cost_per_call; } catch { results["retry_cost"] = 0; }
  try { results["egress_overrun_cost"] = input.data_egress_gb * input.egress_cost_per_gb * (input.overrun_rate / 100) * 0.5; } catch { results["egress_overrun_cost"] = 0; }
  try { results["sla_penalty_cost"] = ((input.overrun_rate > 0) ? (input.monthly_service_fee * (input.sla_penalty_percentage / 100)) : (0)); } catch { results["sla_penalty_cost"] = 0; }
  try { results["hidden_loss_drivers"] = ((input.include_hidden_costs = true) ? (((results["direct_overrun_cost"] ?? 0) + (results["retry_cost"] ?? 0)) * 0.3) : (0)); } catch { results["hidden_loss_drivers"] = 0; }
  try { results["total_overrun_cost"] = (results["direct_overrun_cost"] ?? 0) + (results["retry_cost"] ?? 0) + (results["egress_overrun_cost"] ?? 0) + (results["sla_penalty_cost"] ?? 0) + (results["hidden_loss_drivers"] ?? 0); } catch { results["total_overrun_cost"] = 0; }
  return results;
}


export function calculateCloud_api_overrun_cost(input: Cloud_api_overrun_costInput): Cloud_api_overrun_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_overrun_cost"] ?? 0;
  const breakdown = {
    direct_overrun_cost: values["direct_overrun_cost"] ?? 0,
    retry_cost: values["retry_cost"] ?? 0,
    egress_overrun_cost: values["egress_overrun_cost"] ?? 0,
    sla_penalty_cost: values["sla_penalty_cost"] ?? 0,
    hidden_loss_drivers: values["hidden_loss_drivers"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Customer Churn Impact","Brand Reputation Cost","Operational Overhead"];
  const suggestedActions: string[] = ["Optimize API Endpoints","Implement Caching","Adjust Retry Policy","Negotiate SLA Terms","Monitor Data Egress"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-region comparison","Automated SLA compliance report"],
  };
}


export interface Cloud_api_overrun_costOutput {
  totalWasteCost: number;
  breakdown: { direct_overrun_cost: number; retry_cost: number; egress_overrun_cost: number; sla_penalty_cost: number; hidden_loss_drivers: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
