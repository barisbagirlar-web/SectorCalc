// Auto-generated from product-complexity-hidden-cost-schema.json
import * as z from 'zod';

export interface Product_complexity_hidden_costInput {
  num_sku: number;
  avg_volume_per_sku: number;
  num_components: number;
  avg_bom_levels: number;
  setup_time_minutes: number;
  labor_rate: number;
  overhead_rate: number;
  complexity_type: string;
  use_lean_metrics: boolean;
}

export const Product_complexity_hidden_costInputSchema = z.object({
  num_sku: z.number().min(1).max(100000).default(100),
  avg_volume_per_sku: z.number().min(1).max(10000000).default(5000),
  num_components: z.number().min(1).max(50000).default(500),
  avg_bom_levels: z.number().min(1).max(20).default(3),
  setup_time_minutes: z.number().min(0).max(480).default(45),
  labor_rate: z.number().min(5).max(150).default(25),
  overhead_rate: z.number().min(0).max(500).default(150),
  complexity_type: z.enum(['product', 'process', 'mixed']).default('mixed'),
  use_lean_metrics: z.boolean().default(true),
});

function evaluateAllFormulas(input: Product_complexity_hidden_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["setup_cost_per_sku"] = (input.setup_time_minutes / 60) * input.labor_rate * (input.num_sku / (input.avg_volume_per_sku / 1000)); } catch { results["setup_cost_per_sku"] = 0; }
  try { results["inventory_holding_cost"] = input.num_components * input.avg_bom_levels * 0.02 * (input.avg_volume_per_sku * 0.5) * 0.25; } catch { results["inventory_holding_cost"] = 0; }
  try { results["quality_loss_cost"] = input.num_sku * input.avg_volume_per_sku * 0.005 * (input.labor_rate * 0.5 + 10); } catch { results["quality_loss_cost"] = 0; }
  try { results["overhead_complexity_penalty"] = (input.num_sku * 0.1 + input.num_components * 0.05) * input.overhead_rate * 100; } catch { results["overhead_complexity_penalty"] = 0; }
  try { results["lean_adjustment_factor"] = input.use_lean_metrics ? 0.7 : 1.0; } catch { results["lean_adjustment_factor"] = 0; }
  try { results["hidden_cost_per_unit"] = ((results["setup_cost_per_sku"] ?? 0) * (results["lean_adjustment_factor"] ?? 0) + (results["inventory_holding_cost"] ?? 0) + (results["quality_loss_cost"] ?? 0) * (results["lean_adjustment_factor"] ?? 0) + (results["overhead_complexity_penalty"] ?? 0)) / (input.num_sku * input.avg_volume_per_sku); } catch { results["hidden_cost_per_unit"] = 0; }
  try { results["total_hidden_cost"] = (results["hidden_cost_per_unit"] ?? 0) * input.num_sku * input.avg_volume_per_sku; } catch { results["total_hidden_cost"] = 0; }
  return results;
}


export function calculateProduct_complexity_hidden_cost(input: Product_complexity_hidden_costInput): Product_complexity_hidden_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_hidden_cost"] ?? 0;
  const breakdown = {
    setup_cost: values["setup_cost"] ?? 0,
    inventory_holding_cost: values["inventory_holding_cost"] ?? 0,
    quality_loss_cost: values["quality_loss_cost"] ?? 0,
    overhead_complexity_penalty: values["overhead_complexity_penalty"] ?? 0,
    hidden_cost_per_unit: values["hidden_cost_per_unit"] ?? 0
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct SKU rationalization workshop","Implement component commonality program","Deploy SMED for top 20% of changeovers","Adopt Lean Six Sigma to reduce defect rate by 50%"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-plant comparison"],
  };
}


export interface Product_complexity_hidden_costOutput {
  totalWasteCost: number;
  breakdown: { setup_cost: number; inventory_holding_cost: number; quality_loss_cost: number; overhead_complexity_penalty: number; hidden_cost_per_unit: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
