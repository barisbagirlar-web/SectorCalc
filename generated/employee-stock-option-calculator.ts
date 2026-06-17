// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Employee_stock_option_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.vestedOptions * input.strikePrice; results["exerciseCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exerciseCost"] = 0; }
  try { const v = input.vestedOptions * input.currentPrice; results["marketValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["marketValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEmployee_stock_option_calculator(input: Employee_stock_option_calculatorInput): Employee_stock_option_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["marketValue"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
