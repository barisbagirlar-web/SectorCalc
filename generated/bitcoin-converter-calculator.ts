// @ts-nocheck
// Auto-generated from bitcoin-converter-calculator-schema.json
import * as z from 'zod';

export interface Bitcoin_converter_calculatorInput {
  btcAmount: number;
  usdAmount: number;
  btcPrice: number;
  feePercent: number;
  fixedFee: number;
}

export const Bitcoin_converter_calculatorInputSchema = z.object({
  btcAmount: z.number().default(0),
  usdAmount: z.number().default(0),
  btcPrice: z.number().default(30000),
  feePercent: z.number().default(0.5),
  fixedFee: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bitcoin_converter_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.btcAmount !== 0) ? (input.btcAmount * input.btcPrice * (1 - input.feePercent/100) - input.fixedFee) : ((input.usdAmount + input.fixedFee) / (input.btcPrice * (1 - input.feePercent/100))); results["convertedAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["convertedAmount"] = 0; }
  try { const v = input.btcAmount * input.btcPrice; results["grossValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossValue"] = 0; }
  try { const v = (input.btcAmount !== 0) ? (input.btcAmount * input.btcPrice * (input.feePercent/100) + input.fixedFee) : ((input.usdAmount + input.fixedFee) * (input.feePercent/100) + input.fixedFee); results["totalFees"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFees"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBitcoin_converter_calculator(input: Bitcoin_converter_calculatorInput): Bitcoin_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["convertedAmount"]);
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


export interface Bitcoin_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
