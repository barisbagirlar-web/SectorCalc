// Auto-generated from payback-period-calculator-schema.json
import * as z from 'zod';

export interface Payback_period_calculatorInput {
  initialInvestment: number;
  annualNetCashFlow: number;
  annualGrowthRate: number;
  salvageValue: number;
  dataConfidence?: number;
}

export const Payback_period_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(100000),
  annualNetCashFlow: z.number().default(20000),
  annualGrowthRate: z.number().default(0),
  salvageValue: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Payback_period_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialInvestment; results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.annualNetCashFlow; results["annualCashFlowDisplay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualCashFlowDisplay"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePayback_period_calculator(input: Payback_period_calculatorInput): Payback_period_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["annualCashFlowDisplay"]));
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


export interface Payback_period_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
