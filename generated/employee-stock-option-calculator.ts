// Auto-generated from employee-stock-option-calculator-schema.json
import * as z from 'zod';

export interface Employee_stock_option_calculatorInput {
  strikePrice: number;
  currentPrice: number;
  numberOfOptions: number;
  vestedOptions: number;
}

export const Employee_stock_option_calculatorInputSchema = z.object({
  strikePrice: z.number().default(10),
  currentPrice: z.number().default(15),
  numberOfOptions: z.number().default(1000),
  vestedOptions: z.number().default(500),
});

function evaluateAllFormulas(input: Employee_stock_option_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.currentPrice - input.strikePrice); results["intrinsicValuePerOption"] = Number.isFinite(v) ? v : 0; } catch { results["intrinsicValuePerOption"] = 0; }
  try { const v = input.vestedOptions * input.strikePrice; results["exerciseCost"] = Number.isFinite(v) ? v : 0; } catch { results["exerciseCost"] = 0; }
  try { const v = input.vestedOptions * input.currentPrice; results["marketValue"] = Number.isFinite(v) ? v : 0; } catch { results["marketValue"] = 0; }
  try { const v = Math.max(0, input.currentPrice - input.strikePrice) * input.vestedOptions; results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


export function calculateEmployee_stock_option_calculator(input: Employee_stock_option_calculatorInput): Employee_stock_option_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netProfit"] ?? 0;
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


export interface Employee_stock_option_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
