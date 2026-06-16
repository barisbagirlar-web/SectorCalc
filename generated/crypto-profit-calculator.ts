// Auto-generated from crypto-profit-calculator-schema.json
import * as z from 'zod';

export interface Crypto_profit_calculatorInput {
  investment: number;
  buyPrice: number;
  sellPrice: number;
  feePercent: number;
  taxPercent: number;
}

export const Crypto_profit_calculatorInputSchema = z.object({
  investment: z.number().default(1000),
  buyPrice: z.number().default(100),
  sellPrice: z.number().default(150),
  feePercent: z.number().default(0.5),
  taxPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Crypto_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.investment / input.buyPrice; results["amount"] = Number.isFinite(v) ? v : 0; } catch { results["amount"] = 0; }
  try { const v = (results["amount"] ?? 0) * input.sellPrice - input.investment; results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.investment * input.feePercent / 100; results["buyFee"] = Number.isFinite(v) ? v : 0; } catch { results["buyFee"] = 0; }
  try { const v = (results["amount"] ?? 0) * input.sellPrice * input.feePercent / 100; results["sellFee"] = Number.isFinite(v) ? v : 0; } catch { results["sellFee"] = 0; }
  try { const v = (results["grossProfit"] ?? 0) - (results["buyFee"] ?? 0) - (results["sellFee"] ?? 0); results["netProfitBeforeTax"] = Number.isFinite(v) ? v : 0; } catch { results["netProfitBeforeTax"] = 0; }
  try { const v = (results["netProfitBeforeTax"] ?? 0) * input.taxPercent / 100; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["netProfitBeforeTax"] ?? 0) - (results["taxAmount"] ?? 0); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((results["netProfit"] ?? 0) / input.investment) * 100; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


export function calculateCrypto_profit_calculator(input: Crypto_profit_calculatorInput): Crypto_profit_calculatorOutput {
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


export interface Crypto_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
