// @ts-nocheck
// Auto-generated from npv-calculator-schema.json
import * as z from 'zod';

export interface Npv_calculatorInput {
  initial_investment: number;
  discount_rate: number;
  project_life_years: number;
  annual_cash_inflow: number;
  annual_cash_outflow: number;
  salvage_value: number;
  inflation_rate: number;
  tax_rate: number;
}

export const Npv_calculatorInputSchema = z.object({
  initial_investment: z.number().min(0).max(100000000).default(100000),
  discount_rate: z.number().min(0).max(100).default(8),
  project_life_years: z.number().min(1).max(50).default(10),
  annual_cash_inflow: z.number().min(0).max(100000000).default(25000),
  annual_cash_outflow: z.number().min(0).max(100000000).default(5000),
  salvage_value: z.number().min(0).max(100000000).default(10000),
  inflation_rate: z.number().min(0).max(100).default(2),
  tax_rate: z.number().min(0).max(100).default(25),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Npv_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.project_life_years * input.initial_investment; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.project_life_years * input.initial_investment * (1 + (input.discount_rate / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.project_life_years * input.initial_investment * (1 + (input.discount_rate / 100)) * (input.annual_cash_inflow); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.annual_cash_inflow; results["factor_annual_cash_inflow"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_annual_cash_inflow"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNpv_calculator(input: Npv_calculatorInput): Npv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-scenario comparison"],
  };
}


export interface Npv_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
