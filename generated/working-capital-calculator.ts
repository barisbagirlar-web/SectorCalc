// Auto-generated from working-capital-calculator-schema.json
import * as z from 'zod';

export interface Working_capital_calculatorInput {
  cash: number;
  receivables: number;
  inventory: number;
  payables: number;
  shortTermDebt: number;
  dataConfidence?: number;
}

export const Working_capital_calculatorInputSchema = z.object({
  cash: z.number().default(0),
  receivables: z.number().default(0),
  inventory: z.number().default(0),
  payables: z.number().default(0),
  shortTermDebt: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Working_capital_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cash + input.receivables + input.inventory; results["currentAssets"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentAssets"] = Number.NaN; }
  try { const v = input.payables + input.shortTermDebt; results["currentLiabilities"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentLiabilities"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["currentAssets"])) - (toNumericFormulaValue(results["currentLiabilities"])); results["workingCapital"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["workingCapital"] = Number.NaN; }
  return results;
}


export function calculateWorking_capital_calculator(input: Working_capital_calculatorInput): Working_capital_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["currentAssets"]);
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


export interface Working_capital_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
