// Auto-generated from hourly-rate-calculator-schema.json
import * as z from 'zod';

export interface Hourly_rate_calculatorInput {
  direct_labor_hours: number;
  hourly_wage: number;
  overhead_rate: number;
  tooling_cost_per_unit: number;
  quality_cost_per_unit: number;
  batch_size: number;
  setup_time_hours: number;
  machine_rate: number;
  profit_margin: number;
  currency: string;
  include_setup: boolean;
}

export const Hourly_rate_calculatorInputSchema = z.object({
  direct_labor_hours: z.number().min(0.1).max(100).default(1),
  hourly_wage: z.number().min(7.25).max(200).default(25),
  overhead_rate: z.number().min(0).max(500).default(150),
  tooling_cost_per_unit: z.number().min(0).max(1000).default(2.5),
  quality_cost_per_unit: z.number().min(0).max(500).default(1.2),
  batch_size: z.number().min(1).max(100000).default(100),
  setup_time_hours: z.number().min(0).max(48).default(2),
  machine_rate: z.number().min(0).max(1000).default(50),
  profit_margin: z.number().min(0).max(100).default(20),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CNY']).default('USD'),
  include_setup: z.boolean().default(true),
});

function evaluateAllFormulas(input: Hourly_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["direct_labor_cost"] = input.direct_labor_hours * input.hourly_wage; } catch { results["direct_labor_cost"] = 0; }
  try { results["overhead_cost"] = (results["direct_labor_cost"] ?? 0) * (input.overhead_rate / 100); } catch { results["overhead_cost"] = 0; }
  try { results["setup_cost_per_unit"] = input.include_setup ? (input.setup_time_hours * input.machine_rate) / input.batch_size : 0; } catch { results["setup_cost_per_unit"] = 0; }
  try { results["machine_cost_per_unit"] = input.direct_labor_hours * input.machine_rate; } catch { results["machine_cost_per_unit"] = 0; }
  try { results["total_cost_per_unit"] = (results["direct_labor_cost"] ?? 0) + (results["overhead_cost"] ?? 0) + input.tooling_cost_per_unit + input.quality_cost_per_unit + (results["setup_cost_per_unit"] ?? 0) + (results["machine_cost_per_unit"] ?? 0); } catch { results["total_cost_per_unit"] = 0; }
  try { results["hourly_rate"] = (results["total_cost_per_unit"] ?? 0) / input.direct_labor_hours; } catch { results["hourly_rate"] = 0; }
  try { results["selling_price_per_unit"] = (results["total_cost_per_unit"] ?? 0) * (1 + input.profit_margin / 100); } catch { results["selling_price_per_unit"] = 0; }
  return results;
}


export function calculateHourly_rate_calculator(input: Hourly_rate_calculatorInput): Hourly_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hourly_rate"] ?? 0;
  const breakdown = {
    direct_labor_cost: values["direct_labor_cost"] ?? 0,
    overhead_cost: values["overhead_cost"] ?? 0,
    tooling_cost_per_unit: values["tooling_cost_per_unit"] ?? 0,
    quality_cost_per_unit: values["quality_cost_per_unit"] ?? 0,
    setup_cost_per_unit: values["setup_cost_per_unit"] ?? 0,
    machine_cost_per_unit: values["machine_cost_per_unit"] ?? 0,
    profit_margin_amount: values["profit_margin_amount"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Setup Time","High Quality Cost","Overhead Bloat"];
  const suggestedActions: string[] = ["Reduce Setup Time","Improve Quality","Review Overhead Allocation","Increase Batch Size"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-currency support","Benchmarking against industry standards"],
  };
}


export interface Hourly_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: { direct_labor_cost: number; overhead_cost: number; tooling_cost_per_unit: number; quality_cost_per_unit: number; setup_cost_per_unit: number; machine_cost_per_unit: number; profit_margin_amount: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
