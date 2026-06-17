// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Payment_term_optimizer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.avg_invoice_value + input.annual_invoice_count + input.current_terms_days; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.avg_invoice_value + input.annual_invoice_count + input.current_terms_days; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePayment_term_optimizer_calculator(input: Payment_term_optimizer_calculatorInput): Payment_term_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Benchmarking against industry standards"],
  };
}


export interface Payment_term_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
