// Auto-generated from payback-period-calculator-schema.json
import * as z from 'zod';

export interface Payback_period_calculatorInput {
  initialInvestment: number;
  annualNetCashFlow: number;
  annualGrowthRate: number;
  salvageValue: number;
}

export const Payback_period_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(100000),
  annualNetCashFlow: z.number().default(20000),
  annualGrowthRate: z.number().default(0),
  salvageValue: z.number().default(0),
});

function evaluateAllFormulas(input: Payback_period_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualGrowthRate === 0 ? input.initialInvestment / input.annualNetCashFlow : Math.log(1 + (input.initialInvestment * (input.annualGrowthRate / 100)) / input.annualNetCashFlow) / Math.log(1 + (input.annualGrowthRate / 100)); results["paybackPeriod"] = Number.isFinite(v) ? v : 0; } catch { results["paybackPeriod"] = 0; }
  try { const v = input.initialInvestment; results["totalInvestment"] = Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.annualNetCashFlow; results["annualCashFlowDisplay"] = Number.isFinite(v) ? v : 0; } catch { results["annualCashFlowDisplay"] = 0; }
  return results;
}


export function calculatePayback_period_calculator(input: Payback_period_calculatorInput): Payback_period_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["paybackPeriod"] ?? 0;
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


export interface Payback_period_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
