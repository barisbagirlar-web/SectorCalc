// Auto-generated from operating-cash-flow-calculator-schema.json
import * as z from 'zod';

export interface Operating_cash_flow_calculatorInput {
  revenue: number;
  operatingExpenses: number;
  taxRate: number;
  depreciation: number;
}

export const Operating_cash_flow_calculatorInputSchema = z.object({
  revenue: z.number().default(1000000),
  operatingExpenses: z.number().default(600000),
  taxRate: z.number().default(25),
  depreciation: z.number().default(50000),
});

function evaluateAllFormulas(input: Operating_cash_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.revenue - input.operatingExpenses) * (1 - input.taxRate / 100) + input.depreciation; results["operatingCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["operatingCashFlow"] = 0; }
  try { const v = input.revenue - input.operatingExpenses; results["ebit"] = Number.isFinite(v) ? v : 0; } catch { results["ebit"] = 0; }
  try { const v = (input.revenue - input.operatingExpenses) * input.taxRate / 100; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (input.revenue - input.operatingExpenses) * (1 - input.taxRate / 100); results["afterTaxEBIT"] = Number.isFinite(v) ? v : 0; } catch { results["afterTaxEBIT"] = 0; }
  try { const v = EBIT; results["EBIT"] = Number.isFinite(v) ? v : 0; } catch { results["EBIT"] = 0; }
  results["Tax_Amount"] = 0;
  try { const v = After-Tax (results["EBIT"] ?? 0); results["After_Tax_EBIT"] = Number.isFinite(v) ? v : 0; } catch { results["After_Tax_EBIT"] = 0; }
  results["Depreciation_Add_back"] = 0;
  return results;
}


export function calculateOperating_cash_flow_calculator(input: Operating_cash_flow_calculatorInput): Operating_cash_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["operatingCashFlow"] ?? 0;
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


export interface Operating_cash_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
