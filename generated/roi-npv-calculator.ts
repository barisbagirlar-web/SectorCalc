// Auto-generated from roi-npv-calculator-schema.json
import * as z from 'zod';

export interface Roi_npv_calculatorInput {
  initial_investment: number;
  annual_cash_inflow: number;
  annual_cash_outflow: number;
  discount_rate: number;
  project_life_years: number;
  salvage_value: number;
  inflation_rate: number;
  tax_rate: number;
  dataConfidence?: number;
}

export const Roi_npv_calculatorInputSchema = z.object({
  initial_investment: z.number().min(0).max(100000000).default(100000),
  annual_cash_inflow: z.number().min(0).max(100000000).default(30000),
  annual_cash_outflow: z.number().min(0).max(100000000).default(5000),
  discount_rate: z.number().min(0).max(100).default(10),
  project_life_years: z.number().min(1).max(50).default(5),
  salvage_value: z.number().min(0).max(100000000).default(10000),
  inflation_rate: z.number().min(0).max(100).default(2),
  tax_rate: z.number().min(0).max(100).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roi_npv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.project_life_years * input.initial_investment; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.project_life_years * input.initial_investment * (1 + (input.discount_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.project_life_years * input.initial_investment * (1 + (input.discount_rate / 100)) * (input.annual_cash_inflow); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.annual_cash_inflow; results["factor_annual_cash_inflow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_annual_cash_inflow"] = Number.NaN; }
  return results;
}


export function calculateRoi_npv_calculator(input: Roi_npv_calculatorInput): Roi_npv_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Sensitivity analysis","Multi-scenario comparison","Automated report generation"],
  };
}


export interface Roi_npv_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
