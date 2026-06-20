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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Currency_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sourceAmount * input.exchangeRate - (input.fixedFee + input.sourceAmount * input.percentageFee) * input.exchangeRate; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.sourceAmount * input.exchangeRate - input.fixedFee * input.exchangeRate - input.sourceAmount * input.percentageFee * input.exchangeRate; results["netAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAmount"] = Number.NaN; }
  try { const v = input.fixedFee * input.exchangeRate + input.sourceAmount * input.percentageFee * input.exchangeRate; results["totalFees"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFees"] = Number.NaN; }
  return results;
}


export function calculateCurrency_converter_calculator(input: Currency_converter_calculatorInput): Currency_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Percentage fee applied to source amount before conversion","Fixed fee in source currency converted at same rate"];
  const suggestedActions: string[] = ["Negotiate lower percentage fee for large transfers","Compare exchange rates across providers to minimize spread"];
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
