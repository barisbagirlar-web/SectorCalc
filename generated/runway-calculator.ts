// Auto-generated from runway-calculator-schema.json
import * as z from 'zod';

export interface Runway_calculatorInput {
  cash_balance: number;
  monthly_expenses: number;
  monthly_revenue: number;
  buffer_percent: number;
  dataConfidence?: number;
}

export const Runway_calculatorInputSchema = z.object({
  cash_balance: z.number().default(100000),
  monthly_expenses: z.number().default(10000),
  monthly_revenue: z.number().default(5000),
  buffer_percent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Runway_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthly_expenses - input.monthly_revenue; results["net_monthly_burn"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["net_monthly_burn"] = 0; }
  try { const v = input.cash_balance * (1 - input.buffer_percent / 100); results["effective_cash"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effective_cash"] = 0; }
  try { const v = (asFormulaNumber(results["net_monthly_burn"])) > 0 ? (asFormulaNumber(results["effective_cash"])) / (asFormulaNumber(results["net_monthly_burn"])) : Infinity; results["runway_months"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["runway_months"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRunway_calculator(input: Runway_calculatorInput): Runway_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["runway_months"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Runway_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
