// @ts-nocheck
// Auto-generated from product-complexity-hidden-cost-calculator-schema.json
import * as z from 'zod';

export interface Product_complexity_hidden_cost_calculatorInput {
  num_sku: number;
  avg_volume_per_sku: number;
  num_components: number;
  avg_bom_levels: number;
  setup_time_minutes: number;
  labor_rate: number;
  overhead_rate: number;
  complexity_type: string;
}

export const Product_complexity_hidden_cost_calculatorInputSchema = z.object({
  num_sku: z.number().min(1).max(100000).default(100),
  avg_volume_per_sku: z.number().min(1).max(10000000).default(5000),
  num_components: z.number().min(1).max(50000).default(500),
  avg_bom_levels: z.number().min(1).max(20).default(3),
  setup_time_minutes: z.number().min(0).max(480).default(45),
  labor_rate: z.number().min(5).max(150).default(25),
  overhead_rate: z.number().min(0).max(500).default(150),
  complexity_type: z.enum(['product', 'process', 'mixed']).default('mixed'),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Product_complexity_hidden_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.num_sku * input.avg_volume_per_sku * input.num_components * input.avg_bom_levels; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.num_sku * input.avg_volume_per_sku * input.num_components * input.avg_bom_levels * (input.setup_time_minutes * (input.labor_rate / 100) * (input.overhead_rate / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.setup_time_minutes * (input.labor_rate / 100) * (input.overhead_rate / 100); results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateProduct_complexity_hidden_cost_calculator(input: Product_complexity_hidden_cost_calculatorInput): Product_complexity_hidden_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-plant comparison"],
  };
}


export interface Product_complexity_hidden_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
