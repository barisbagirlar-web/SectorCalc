// Auto-generated from payment-term-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Payment_term_optimizer_calculatorInput {
  avg_invoice_value: number;
  annual_invoice_count: number;
  current_terms_days: number;
  proposed_terms_days: number;
  early_payment_discount_pct: number;
  discount_window_days: number;
  cost_of_capital_pct: number;
  customer_acceptance_rate_pct: number;
  dataConfidence?: number;
}

export const Payment_term_optimizer_calculatorInputSchema = z.object({
  avg_invoice_value: z.number().min(100).max(10000000).default(10000),
  annual_invoice_count: z.number().min(12).max(1000000).default(1200),
  current_terms_days: z.number().min(0).max(180).default(30),
  proposed_terms_days: z.number().min(0).max(180).default(15),
  early_payment_discount_pct: z.number().min(0).max(10).default(2),
  discount_window_days: z.number().min(0).max(60).default(10),
  cost_of_capital_pct: z.number().min(0).max(30).default(8),
  customer_acceptance_rate_pct: z.number().min(0).max(100).default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Payment_term_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_invoice_count * input.avg_invoice_value; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.annual_invoice_count * input.avg_invoice_value * (1 + (input.early_payment_discount_pct / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.annual_invoice_count * input.avg_invoice_value * (1 + (input.early_payment_discount_pct / 100)) * (input.current_terms_days); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.current_terms_days; results["factor_current_terms_days"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_current_terms_days"] = Number.NaN; }
  return results;
}


export function calculatePayment_term_optimizer_calculator(input: Payment_term_optimizer_calculatorInput): Payment_term_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_current_terms_days: toNumericFormulaValue(values["factor_current_terms_days"])
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Benchmarking against industry standards"],
  };
}


export interface Payment_term_optimizer_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_current_terms_days: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Payment_term_optimizer_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_current_terms_days"],
} as const;

