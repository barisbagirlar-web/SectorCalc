// Auto-generated from ai-compute-token-cost-calculator-schema.json
import * as z from 'zod';

export interface Ai_compute_token_cost_calculatorInput {
  model_type: string;
  input_tokens_per_month: number;
  output_tokens_per_month: number;
  batch_size: number;
  compute_hours_per_month: number;
  gpu_hourly_cost: number;
  overhead_factor: number;
  enable_data_confidence: boolean;
  dataConfidence?: number;
}

export const Ai_compute_token_cost_calculatorInputSchema = z.object({
  model_type: z.string().default(''),
  input_tokens_per_month: z.number().min(0).max(1000000000).default(1000000),
  output_tokens_per_month: z.number().min(0).max(1000000000).default(500000),
  batch_size: z.number().min(1).max(1000).default(1),
  compute_hours_per_month: z.number().min(0).max(744).default(720),
  gpu_hourly_cost: z.number().min(0).max(100).default(2.5),
  overhead_factor: z.number().min(0).max(100).default(15),
  enable_data_confidence: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ai_compute_token_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.input_tokens_per_month * input.output_tokens_per_month * input.batch_size * input.compute_hours_per_month; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.input_tokens_per_month * input.output_tokens_per_month * input.batch_size * input.compute_hours_per_month * (input.gpu_hourly_cost * (input.overhead_factor / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.gpu_hourly_cost * (input.overhead_factor / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateAi_compute_token_cost_calculator(input: Ai_compute_token_cost_calculatorInput): Ai_compute_token_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Anomaly detection alerts"],
  };
}


export interface Ai_compute_token_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
