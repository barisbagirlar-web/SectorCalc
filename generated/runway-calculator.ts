// Auto-generated from runway-calculator-schema.json
import * as z from 'zod';

export interface Runway_calculatorInput {
  cash_balance: number;
  monthly_expenses: number;
  monthly_revenue: number;
  buffer_percent: number;
}

export const Runway_calculatorInputSchema = z.object({
  cash_balance: z.number().default(100000),
  monthly_expenses: z.number().default(10000),
  monthly_revenue: z.number().default(5000),
  buffer_percent: z.number().default(0),
});

function evaluateAllFormulas(input: Runway_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthly_expenses - input.monthly_revenue; results["net_monthly_burn"] = Number.isFinite(v) ? v : 0; } catch { results["net_monthly_burn"] = 0; }
  try { const v = input.cash_balance * (1 - input.buffer_percent / 100); results["effective_cash"] = Number.isFinite(v) ? v : 0; } catch { results["effective_cash"] = 0; }
  try { const v = (results["net_monthly_burn"] ?? 0) > 0 ? (results["effective_cash"] ?? 0) / (results["net_monthly_burn"] ?? 0) : Infinity; results["runway_months"] = Number.isFinite(v) ? v : 0; } catch { results["runway_months"] = 0; }
  return results;
}


export function calculateRunway_calculator(input: Runway_calculatorInput): Runway_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["runway_months"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
