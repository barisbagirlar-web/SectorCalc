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
  industry_benchmark_dso: number;
  payment_behavior: string;
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
  industry_benchmark_dso: z.number().min(0).max(180).default(45),
  payment_behavior: z.enum(['On-time', 'Slightly late (1-5 days)', 'Late (6-15 days)', 'Very late (>15 days)']).default('On-time'),
});

function evaluateAllFormulas(input: Payment_term_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avg_invoice_value * input.annual_invoice_count; results["annual_revenue"] = Number.isFinite(v) ? v : 0; } catch { results["annual_revenue"] = 0; }
  try { const v = input.current_terms_days + (input.payment_behavior === 'On-time' ? 0 : (input.payment_behavior === 'Slightly late (1-5 days)' ? 3 : (input.payment_behavior === 'Late (6-15 days)' ? 10 : (input.payment_behavior === 'Very late (>15 days)' ? 20 : 0)))); results["current_dso"] = Number.isFinite(v) ? v : 0; } catch { results["current_dso"] = 0; }
  try { const v = (input.customer_acceptance_rate_pct/100) * input.discount_window_days + (1 - input.customer_acceptance_rate_pct/100) * input.proposed_terms_days + (input.payment_behavior === 'On-time' ? 0 : (input.payment_behavior === 'Slightly late (1-5 days)' ? 3 : (input.payment_behavior === 'Late (6-15 days)' ? 10 : (input.payment_behavior === 'Very late (>15 days)' ? 20 : 0)))); results["proposed_dso"] = Number.isFinite(v) ? v : 0; } catch { results["proposed_dso"] = 0; }
  try { const v = (results["current_dso"] ?? 0) - (results["proposed_dso"] ?? 0); results["dso_reduction_days"] = Number.isFinite(v) ? v : 0; } catch { results["dso_reduction_days"] = 0; }
  try { const v = ((results["dso_reduction_days"] ?? 0) / 365) * (results["annual_revenue"] ?? 0); results["working_capital_benefit"] = Number.isFinite(v) ? v : 0; } catch { results["working_capital_benefit"] = 0; }
  try { const v = (results["annual_revenue"] ?? 0) * (input.customer_acceptance_rate_pct/100) * (input.early_payment_discount_pct/100); results["annual_discount_cost"] = Number.isFinite(v) ? v : 0; } catch { results["annual_discount_cost"] = 0; }
  try { const v = (results["working_capital_benefit"] ?? 0) * (input.cost_of_capital_pct/100); results["cost_of_capital_savings"] = Number.isFinite(v) ? v : 0; } catch { results["cost_of_capital_savings"] = 0; }
  try { const v = (results["cost_of_capital_savings"] ?? 0) - (results["annual_discount_cost"] ?? 0); results["net_annual_benefit"] = Number.isFinite(v) ? v : 0; } catch { results["net_annual_benefit"] = 0; }
  return results;
}


export function calculatePayment_term_optimizer_calculator(input: Payment_term_optimizer_calculatorInput): Payment_term_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["net_annual_benefit"] ?? 0;
  const breakdown = {
    annual_revenue: values["annual_revenue"] ?? 0,
    current_dso: values["current_dso"] ?? 0,
    proposed_dso: values["proposed_dso"] ?? 0,
    dso_reduction_days: values["dso_reduction_days"] ?? 0,
    working_capital_benefit: values["working_capital_benefit"] ?? 0,
    annual_discount_cost: values["annual_discount_cost"] ?? 0,
    cost_of_capital_savings: values["cost_of_capital_savings"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Lost Revenue from Discount","Customer Relationship Risk","Operational Disruption Cost"];
  const suggestedActions: string[] = ["If net benefit is positive, implement proposed terms with a pilot group of customers.","If acceptance rate is low, consider increasing discount percentage or extending discount window.","Monitor DSO monthly and compare to industry benchmark (ISO 30400, WERC DSO standards).","Use Six Sigma DMAIC to reduce variability in payment behavior."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Benchmarking against industry standards"],
  };
}


export interface Payment_term_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { annual_revenue: number; current_dso: number; proposed_dso: number; dso_reduction_days: number; working_capital_benefit: number; annual_discount_cost: number; cost_of_capital_savings: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
