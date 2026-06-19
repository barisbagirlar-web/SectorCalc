// Auto-generated from employee-stock-option-calculator-schema.json
import * as z from 'zod';

export interface Employee_stock_option_calculatorInput {
  strikePrice: number;
  currentPrice: number;
  numberOfOptions: number;
  vestedOptions: number;
  dataConfidence?: number;
}

export const Employee_stock_option_calculatorInputSchema = z.object({
  strikePrice: z.number().default(10),
  currentPrice: z.number().default(15),
  numberOfOptions: z.number().default(1000),
  vestedOptions: z.number().default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Employee_stock_option_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vestedOptions * input.strikePrice; results["exerciseCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exerciseCost"] = 0; }
  try { const v = input.vestedOptions * input.currentPrice; results["marketValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["marketValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEmployee_stock_option_calculator(input: Employee_stock_option_calculatorInput): Employee_stock_option_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["marketValue"]);
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


export interface Employee_stock_option_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
