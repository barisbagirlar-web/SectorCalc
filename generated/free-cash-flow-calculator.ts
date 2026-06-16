// Auto-generated from free-cash-flow-calculator-schema.json
import * as z from 'zod';

export interface Free_cash_flow_calculatorInput {
  ebit: number;
  taxRate: number;
  depreciation: number;
  capex: number;
  changeNWC: number;
}

export const Free_cash_flow_calculatorInputSchema = z.object({
  ebit: z.number().default(1000000),
  taxRate: z.number().default(30),
  depreciation: z.number().default(100000),
  capex: z.number().default(200000),
  changeNWC: z.number().default(50000),
});

function evaluateAllFormulas(input: Free_cash_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ebit * (1 - input.taxRate / 100) + input.depreciation - input.changeNWC - input.capex; results["freeCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["freeCashFlow"] = 0; }
  try { const v = input.ebit * (1 - input.taxRate / 100) + input.depreciation; results["operatingCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["operatingCashFlow"] = 0; }
  try { const v = input.capex + input.changeNWC; results["capitalInvestments"] = Number.isFinite(v) ? v : 0; } catch { results["capitalInvestments"] = 0; }
  return results;
}


export function calculateFree_cash_flow_calculator(input: Free_cash_flow_calculatorInput): Free_cash_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["freeCashFlow"] ?? 0;
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


export interface Free_cash_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
