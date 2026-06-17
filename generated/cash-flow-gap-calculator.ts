// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cash_flow_gap_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.avg_days_receivable + input.avg_days_payable + input.inventory_days; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.avg_days_receivable + input.avg_days_payable + input.inventory_days; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCash_flow_gap_calculator(input: Cash_flow_gap_calculatorInput): Cash_flow_gap_calculatorOutput {
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
