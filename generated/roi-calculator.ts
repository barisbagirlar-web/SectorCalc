// @ts-nocheck
// Auto-generated from roi-calculator-schema.json
import * as z from 'zod';

export interface Roi_calculatorInput {
  annual_revenue: number;
  operating_margin: number;
  total_inventory_value: number;
  inventory_carrying_cost_percent: number;
  annual_labor_cost: number;
  defect_rate_percent: number;
  cost_per_defect: number;
  annual_energy_cost: number;
}

export const Roi_calculatorInputSchema = z.object({
  annual_revenue: z.number().min(100000).max(10000000000).default(10000000),
  operating_margin: z.number().min(0).max(100).default(10),
  total_inventory_value: z.number().min(0).max(1000000000).default(2000000),
  inventory_carrying_cost_percent: z.number().min(0).max(50).default(25),
  annual_labor_cost: z.number().min(0).max(1000000000).default(3000000),
  defect_rate_percent: z.number().min(0).max(100).default(5),
  cost_per_defect: z.number().min(0).max(100000).default(500),
  annual_energy_cost: z.number().min(0).max(100000000).default(500000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annual_revenue + input.operating_margin + input.total_inventory_value; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.annual_revenue + input.operating_margin + input.total_inventory_value; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRoi_calculator(input: Roi_calculatorInput): Roi_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-scenario simulation"],
  };
}


export interface Roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
