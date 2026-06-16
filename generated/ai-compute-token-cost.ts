// Auto-generated from ai-compute-token-cost-schema.json
import * as z from 'zod';

export interface Ai_compute_token_costInput {
  model_type: string;
  input_tokens_per_month: number;
  output_tokens_per_month: number;
  batch_size: number;
  compute_hours_per_month: number;
  gpu_hourly_cost: number;
  overhead_factor: number;
  enable_data_confidence: boolean;
}

export const Ai_compute_token_costInputSchema = z.object({
  model_type: z.string().default(''),
  input_tokens_per_month: z.number().min(0).max(1000000000).default(1000000),
  output_tokens_per_month: z.number().min(0).max(1000000000).default(500000),
  batch_size: z.number().min(1).max(1000).default(1),
  compute_hours_per_month: z.number().min(0).max(744).default(720),
  gpu_hourly_cost: z.number().min(0).max(100).default(2.5),
  overhead_factor: z.number().min(0).max(100).default(15),
  enable_data_confidence: z.boolean().default(true),
});

function evaluateAllFormulas(input: Ai_compute_token_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["sub_input_cost"] = input.input_tokens_per_month * input_token_price(input.model_type); } catch { results["sub_input_cost"] = 0; }
  try { results["sub_output_cost"] = input.output_tokens_per_month * output_token_price(input.model_type); } catch { results["sub_output_cost"] = 0; }
  try { results["sub_compute_cost"] = input.compute_hours_per_month * input.gpu_hourly_cost; } catch { results["sub_compute_cost"] = 0; }
  try { results["sub_overhead_cost"] = ((results["sub_input_cost"] ?? 0) + (results["sub_output_cost"] ?? 0) + (results["sub_compute_cost"] ?? 0)) * (input.overhead_factor / 100); } catch { results["sub_overhead_cost"] = 0; }
  try { results["sub_total_before_confidence"] = (results["sub_input_cost"] ?? 0) + (results["sub_output_cost"] ?? 0) + (results["sub_compute_cost"] ?? 0) + (results["sub_overhead_cost"] ?? 0); } catch { results["sub_total_before_confidence"] = 0; }
  try { results["sub_confidence_factor"] = ((input.enable_data_confidence) ? (0.95) : (1.0)); } catch { results["sub_confidence_factor"] = 0; }
  try { results["primary_total_monthly_cost"] = (results["sub_total_before_confidence"] ?? 0) * (results["sub_confidence_factor"] ?? 0); } catch { results["primary_total_monthly_cost"] = 0; }
  return results;
}


export function calculateAi_compute_token_cost(input: Ai_compute_token_costInput): Ai_compute_token_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_monthly_cost"] ?? 0;
  const breakdown = {
    input_token_cost: values["input_token_cost"] ?? 0,
    output_token_cost: values["output_token_cost"] ?? 0,
    compute_cost: values["compute_cost"] ?? 0,
    overhead_cost: values["overhead_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Idle GPU Time","Token Waste from Retries","Model Overprovisioning"];
  const suggestedActions: string[] = ["Increase batch size to reduce per-request overhead and improve GPU utilization.","Use a distilled or smaller model variant to lower token costs without significant accuracy loss.","Leverage spot/preemptible GPU instances to reduce compute cost by up to 60%.","Implement prompt caching to avoid re-processing identical input tokens."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Anomaly detection alerts"],
  };
}


export interface Ai_compute_token_costOutput {
  totalWasteCost: number;
  breakdown: { input_token_cost: number; output_token_cost: number; compute_cost: number; overhead_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
