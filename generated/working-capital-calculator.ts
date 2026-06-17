// @ts-nocheck
// Auto-generated from working-capital-calculator-schema.json
import * as z from 'zod';

export interface Working_capital_calculatorInput {
  cash: number;
  receivables: number;
  inventory: number;
  payables: number;
  shortTermDebt: number;
}

export const Working_capital_calculatorInputSchema = z.object({
  cash: z.number().default(0),
  receivables: z.number().default(0),
  inventory: z.number().default(0),
  payables: z.number().default(0),
  shortTermDebt: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Working_capital_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.cash + input.receivables + input.inventory; results["currentAssets"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["currentAssets"] = 0; }
  try { const v = input.payables + input.shortTermDebt; results["currentLiabilities"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["currentLiabilities"] = 0; }
  try { const v = (asFormulaNumber(results["currentAssets"])) - (asFormulaNumber(results["currentLiabilities"])); results["workingCapital"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["workingCapital"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWorking_capital_calculator(input: Working_capital_calculatorInput): Working_capital_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["currentAssets"]);
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


export interface Working_capital_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
