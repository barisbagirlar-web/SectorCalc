// Auto-generated from auto-repair-comeback-cost-calculator-schema.json
import * as z from 'zod';

export interface Auto_repair_comeback_cost_calculatorInput {
  total_repair_orders: number;
  comeback_count: number;
  avg_labor_rate: number;
  avg_hours_per_comeback: number;
  parts_cost_per_comeback: number;
  customer_lifetime_value: number;
  lost_customer_rate: number;
  shop_type: string;
  dataConfidence?: number;
}

export const Auto_repair_comeback_cost_calculatorInputSchema = z.object({
  total_repair_orders: z.number().min(1).max(100000).default(500),
  comeback_count: z.number().min(0).max(100000).default(25),
  avg_labor_rate: z.number().min(15).max(250).default(85),
  avg_hours_per_comeback: z.number().min(0.1).max(40).default(2.5),
  parts_cost_per_comeback: z.number().min(0).max(5000).default(45),
  customer_lifetime_value: z.number().min(100).max(50000).default(2500),
  lost_customer_rate: z.number().min(0).max(100).default(15),
  shop_type: z.enum(['independent', 'dealer', 'fleet', 'franchise']).default('independent'),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Auto_repair_comeback_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_repair_orders * input.parts_cost_per_comeback; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.total_repair_orders * input.parts_cost_per_comeback * (1 + (input.avg_labor_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.total_repair_orders * input.parts_cost_per_comeback * (1 + (input.avg_labor_rate / 100)) * (input.comeback_count); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.comeback_count; results["factor_comeback_count"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_comeback_count"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAuto_repair_comeback_cost_calculator(input: Auto_repair_comeback_cost_calculatorInput): Auto_repair_comeback_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry averages","Root cause Pareto chart","Multi-shift comparison"],
  };
}


export interface Auto_repair_comeback_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
