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
  dataConfidence?: number;
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
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cash_flow_gap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avg_days_receivable * input.avg_days_payable * input.inventory_days * input.operating_expenses_daily; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.avg_days_receivable * input.avg_days_payable * input.inventory_days * input.operating_expenses_daily * (input.revenue_daily); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.revenue_daily; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCash_flow_gap_calculator(input: Cash_flow_gap_calculatorInput): Cash_flow_gap_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Benchmarking against industry standards (WERC)"],
  };
}


export interface Cash_flow_gap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
