// @ts-nocheck
// Auto-generated from supplier-performance-tco-calculator-schema.json
import * as z from 'zod';

export interface Supplier_performance_tco_calculatorInput {
  purchase_price: number;
  annual_quantity: number;
  defect_rate: number;
  inspection_cost_per_unit: number;
  freight_cost_per_unit: number;
  lead_time_days: number;
  carrying_cost_rate: number;
  warranty_claim_rate: number;
}

export const Supplier_performance_tco_calculatorInputSchema = z.object({
  purchase_price: z.number().min(0).max(100000).default(100),
  annual_quantity: z.number().min(1).max(10000000).default(10000),
  defect_rate: z.number().min(0).max(100000).default(500),
  inspection_cost_per_unit: z.number().min(0).max(100).default(2),
  freight_cost_per_unit: z.number().min(0).max(500).default(5),
  lead_time_days: z.number().min(1).max(365).default(30),
  carrying_cost_rate: z.number().min(0).max(100).default(25),
  warranty_claim_rate: z.number().min(0).max(100).default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Supplier_performance_tco_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.purchase_price + input.annual_quantity + input.defect_rate; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.purchase_price + input.annual_quantity + input.defect_rate; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSupplier_performance_tco_calculator(input: Supplier_performance_tco_calculatorInput): Supplier_performance_tco_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-supplier comparison","Automated alerting","Benchmarking against industry standards"],
  };
}


export interface Supplier_performance_tco_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
