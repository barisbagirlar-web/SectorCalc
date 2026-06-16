// Auto-generated from cash-flow-gap-calculator-schema.json
import * as z from 'zod';

export interface Cash_flow_gap_calculatorInput {
  avg_days_receivable: number;
  avg_days_payable: number;
  inventory_days: number;
  operating_expenses_daily: number;
  revenue_daily: number;
  payment_terms_suppliers: string;
  customer_payment_behavior: string;
  lean_inventory_flag: boolean;
  six_sigma_quality_level: number;
}

export const Cash_flow_gap_calculatorInputSchema = z.object({
  avg_days_receivable: z.number().min(0).max(365).default(45),
  avg_days_payable: z.number().min(0).max(365).default(30),
  inventory_days: z.number().min(0).max(365).default(60),
  operating_expenses_daily: z.number().min(0).max(10000000).default(10000),
  revenue_daily: z.number().min(0).max(10000000).default(15000),
  payment_terms_suppliers: z.enum(['net15', 'net30', 'net45', 'net60']).default('net30'),
  customer_payment_behavior: z.enum(['fast', 'average', 'slow']).default('average'),
  lean_inventory_flag: z.boolean().default(false),
  six_sigma_quality_level: z.number().min(1).max(6).default(3),
});

function evaluateAllFormulas(input: Cash_flow_gap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avg_days_receivable * (1 + (input.customer_payment_behavior == 'slow' ? 0.2 : input.customer_payment_behavior == 'fast' ? -0.1 : 0)); results["effective_dso"] = Number.isFinite(v) ? v : 0; } catch { results["effective_dso"] = 0; }
  try { const v = (input.payment_terms_suppliers === 'net15' ? 15 : (input.payment_terms_suppliers === 'net30' ? 30 : (input.payment_terms_suppliers === 'net45' ? 45 : (input.payment_terms_suppliers === 'net60' ? 60 : 30)))); results["effective_dpo"] = Number.isFinite(v) ? v : 0; } catch { results["effective_dpo"] = 0; }
  try { const v = input.inventory_days * (input.lean_inventory_flag ? 0.7 : 1.0) * (1 - (input.six_sigma_quality_level - 3.0) * 0.05); results["adjusted_inventory_days"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_inventory_days"] = 0; }
  try { const v = (results["effective_dso"] ?? 0) + (results["adjusted_inventory_days"] ?? 0) - (results["effective_dpo"] ?? 0); results["cash_gap_days"] = Number.isFinite(v) ? v : 0; } catch { results["cash_gap_days"] = 0; }
  try { const v = (results["cash_gap_days"] ?? 0) * input.operating_expenses_daily; results["cash_gap_value"] = Number.isFinite(v) ? v : 0; } catch { results["cash_gap_value"] = 0; }
  try { const v = 1 + (input.six_sigma_quality_level - 3.0) * 0.02; results["revenue_adjustment_factor"] = Number.isFinite(v) ? v : 0; } catch { results["revenue_adjustment_factor"] = 0; }
  try { const v = Math.min(1.0, (input.six_sigma_quality_level / 6.0) * (input.lean_inventory_flag ? 1.1 : 1.0) * 0.9); results["data_confidence_score"] = Number.isFinite(v) ? v : 0; } catch { results["data_confidence_score"] = 0; }
  return results;
}


export function calculateCash_flow_gap_calculator(input: Cash_flow_gap_calculatorInput): Cash_flow_gap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cash_gap_days"] ?? 0;
  const breakdown = {
    effective_dso: values["effective_dso"] ?? 0,
    effective_dpo: values["effective_dpo"] ?? 0,
    adjusted_inventory_days: values["adjusted_inventory_days"] ?? 0,
    cash_gap_value: values["cash_gap_value"] ?? 0,
    revenue_adjustment_factor: values["revenue_adjustment_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Inventory Holding","Late Payment Penalties","Quality Defect Cost"];
  const suggestedActions: string[] = ["Implement stricter credit policies and offer early payment discounts to reduce DSO.","Negotiate longer payment terms with key suppliers without damaging relationships.","Adopt Lean inventory practices (JIT, Kanban) to reduce inventory days.","Invest in Six Sigma projects to improve quality level above 4.5 sigma."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Benchmarking against industry standards (WERC)"],
  };
}


export interface Cash_flow_gap_calculatorOutput {
  totalWasteCost: number;
  breakdown: { effective_dso: number; effective_dpo: number; adjusted_inventory_days: number; cash_gap_value: number; revenue_adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
