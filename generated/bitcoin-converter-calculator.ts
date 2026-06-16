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

function evaluateAllFormulas(input: Bitcoin_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.btcAmount !== 0) ? (input.btcAmount * input.btcPrice * (1 - input.feePercent/100) - input.fixedFee) : ((input.usdAmount + input.fixedFee) / (input.btcPrice * (1 - input.feePercent/100))); results["convertedAmount"] = Number.isFinite(v) ? v : 0; } catch { results["convertedAmount"] = 0; }
  try { const v = input.btcAmount * input.btcPrice; results["grossValue"] = Number.isFinite(v) ? v : 0; } catch { results["grossValue"] = 0; }
  try { const v = (input.btcAmount !== 0) ? (input.btcAmount * input.btcPrice * (input.feePercent/100) + input.fixedFee) : ((input.usdAmount + input.fixedFee) * (input.feePercent/100) + input.fixedFee); results["totalFees"] = Number.isFinite(v) ? v : 0; } catch { results["totalFees"] = 0; }
  return results;
}


export function calculateBitcoin_converter_calculator(input: Bitcoin_converter_calculatorInput): Bitcoin_converter_calculatorOutput {
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


export interface Bitcoin_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
