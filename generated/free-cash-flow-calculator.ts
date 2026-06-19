// Auto-generated from free-cash-flow-calculator-schema.json
import * as z from 'zod';

export interface Free_cash_flow_calculatorInput {
  ebit: number;
  taxRate: number;
  depreciation: number;
  capex: number;
  changeNWC: number;
  dataConfidence?: number;
}

export const Free_cash_flow_calculatorInputSchema = z.object({
  ebit: z.number().default(1000000),
  taxRate: z.number().default(30),
  depreciation: z.number().default(100000),
  capex: z.number().default(200000),
  changeNWC: z.number().default(50000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Free_cash_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ebit * (1 - input.taxRate / 100) + input.depreciation - input.changeNWC - input.capex; results["freeCashFlow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["freeCashFlow"] = 0; }
  try { const v = input.ebit * (1 - input.taxRate / 100) + input.depreciation; results["operatingCashFlow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["operatingCashFlow"] = 0; }
  try { const v = input.capex + input.changeNWC; results["capitalInvestments"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["capitalInvestments"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFree_cash_flow_calculator(input: Free_cash_flow_calculatorInput): Free_cash_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["freeCashFlow"]));
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


export interface Free_cash_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
