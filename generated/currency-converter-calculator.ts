// Auto-generated from currency-converter-calculator-schema.json
import * as z from 'zod';

export interface Currency_converter_calculatorInput {
  sourceAmount: number;
  exchangeRate: number;
  fixedFee: number;
  percentageFee: number;
}

export const Currency_converter_calculatorInputSchema = z.object({
  sourceAmount: z.number().default(100),
  exchangeRate: z.number().default(1.1),
  fixedFee: z.number().default(0),
  percentageFee: z.number().default(0),
});

function evaluateAllFormulas(input: Currency_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.sourceAmount * (1 - input.percentageFee) - input.fixedFee) * input.exchangeRate; results["convertedAmount"] = Number.isFinite(v) ? v : 0; } catch { results["convertedAmount"] = 0; }
  try { const v = Math.max(0, input.sourceAmount * (1 - input.percentageFee) - input.fixedFee); results["netSourceAmount"] = Number.isFinite(v) ? v : 0; } catch { results["netSourceAmount"] = 0; }
  try { const v = input.sourceAmount - Math.max(0, input.sourceAmount * (1 - input.percentageFee) - input.fixedFee); results["totalFees"] = Number.isFinite(v) ? v : 0; } catch { results["totalFees"] = 0; }
  return results;
}


export function calculateCurrency_converter_calculator(input: Currency_converter_calculatorInput): Currency_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["convertedAmount"] ?? 0;
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


export interface Currency_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
