// Auto-generated from currency-converter-calculator-schema.json
import * as z from 'zod';

export interface Currency_converter_calculatorInput {
  sourceAmount: number;
  exchangeRate: number;
  fixedFee: number;
  percentageFee: number;
  dataConfidence?: number;
}

export const Currency_converter_calculatorInputSchema = z.object({
  sourceAmount: z.number().default(100),
  exchangeRate: z.number().default(1.1),
  fixedFee: z.number().default(0),
  percentageFee: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Currency_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sourceAmount * input.exchangeRate * input.fixedFee * (input.percentageFee / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.sourceAmount * input.exchangeRate * input.fixedFee * (input.percentageFee / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCurrency_converter_calculator(input: Currency_converter_calculatorInput): Currency_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Currency_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
