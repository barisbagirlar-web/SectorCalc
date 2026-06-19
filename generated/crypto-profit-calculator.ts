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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Crypto_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.investment / input.buyPrice; results["amount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["amount"] = 0; }
  try { const v = (asFormulaNumber(results["amount"])) * input.sellPrice - input.investment; results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.investment * input.feePercent / 100; results["buyFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["buyFee"] = 0; }
  try { const v = (asFormulaNumber(results["amount"])) * input.sellPrice * input.feePercent / 100; results["sellFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sellFee"] = 0; }
  try { const v = (asFormulaNumber(results["grossProfit"])) - (asFormulaNumber(results["buyFee"])) - (asFormulaNumber(results["sellFee"])); results["netProfitBeforeTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfitBeforeTax"] = 0; }
  try { const v = (asFormulaNumber(results["netProfitBeforeTax"])) * input.taxPercent / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["netProfitBeforeTax"])) - (asFormulaNumber(results["taxAmount"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((asFormulaNumber(results["netProfit"])) / input.investment) * 100; results["roi"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
