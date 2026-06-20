// Auto-generated from operating-cash-flow-calculator-schema.json
import * as z from 'zod';

export interface Operating_cash_flow_calculatorInput {
  revenue: number;
  operatingExpenses: number;
  taxRate: number;
  depreciation: number;
  dataConfidence?: number;
}

export const Operating_cash_flow_calculatorInputSchema = z.object({
  revenue: z.number().default(1000000),
  operatingExpenses: z.number().default(600000),
  taxRate: z.number().default(25),
  depreciation: z.number().default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Operating_cash_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.revenue - input.operatingExpenses) * (1 - input.taxRate / 100) + input.depreciation; results["operatingCashFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingCashFlow"] = Number.NaN; }
  try { const v = input.revenue - input.operatingExpenses; results["ebit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ebit"] = Number.NaN; }
  try { const v = (input.revenue - input.operatingExpenses) * input.taxRate / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (input.revenue - input.operatingExpenses) * (1 - input.taxRate / 100); results["afterTaxEBIT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterTaxEBIT"] = Number.NaN; }
  return results;
}


export function calculateOperating_cash_flow_calculator(input: Operating_cash_flow_calculatorInput): Operating_cash_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["operatingCashFlow"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Operating_cash_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
