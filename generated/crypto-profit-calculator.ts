// Auto-generated from crypto-profit-calculator-schema.json
import * as z from 'zod';

export interface Crypto_profit_calculatorInput {
  investment: number;
  buyPrice: number;
  sellPrice: number;
  feePercent: number;
  taxPercent: number;
  dataConfidence?: number;
}

export const Crypto_profit_calculatorInputSchema = z.object({
  investment: z.number().default(1000),
  buyPrice: z.number().default(100),
  sellPrice: z.number().default(150),
  feePercent: z.number().default(0.5),
  taxPercent: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Crypto_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.investment / input.buyPrice; results["amount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["amount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["amount"])) * input.sellPrice - input.investment; results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossProfit"] = Number.NaN; }
  try { const v = input.investment * input.feePercent / 100; results["buyFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["buyFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["amount"])) * input.sellPrice * input.feePercent / 100; results["sellFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossProfit"])) - (toNumericFormulaValue(results["buyFee"])) - (toNumericFormulaValue(results["sellFee"])); results["netProfitBeforeTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfitBeforeTax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netProfitBeforeTax"])) * input.taxPercent / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netProfitBeforeTax"])) - (toNumericFormulaValue(results["taxAmount"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["netProfit"])) / input.investment) * 100; results["roi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roi"] = Number.NaN; }
  return results;
}


export function calculateCrypto_profit_calculator(input: Crypto_profit_calculatorInput): Crypto_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netProfit"]);
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


export interface Crypto_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
