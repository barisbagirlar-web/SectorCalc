// Auto-generated from credit-card-processing-fee-calculator-schema.json
import * as z from 'zod';

export interface Credit_card_processing_fee_calculatorInput {
  transactionAmount: number;
  processingRate: number;
  perTransactionFee: number;
  monthlyStatementFee: number;
  numberOfTransactions: number;
  dataConfidence?: number;
}

export const Credit_card_processing_fee_calculatorInputSchema = z.object({
  transactionAmount: z.number().default(100),
  processingRate: z.number().default(2.9),
  perTransactionFee: z.number().default(0.3),
  monthlyStatementFee: z.number().default(10),
  numberOfTransactions: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Credit_card_processing_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.transactionAmount * input.processingRate / 100 + input.perTransactionFee + input.monthlyStatementFee / input.numberOfTransactions; results["totalFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFee"] = Number.NaN; }
  try { const v = input.transactionAmount - (toNumericFormulaValue(results["totalFee"])); results["netAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAmount"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["totalFee"])) / input.transactionAmount) * 100; results["effectiveRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalFee"])) * input.numberOfTransactions; results["monthlyTotalFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyTotalFee"] = Number.NaN; }
  return results;
}


export function calculateCredit_card_processing_fee_calculator(input: Credit_card_processing_fee_calculatorInput): Credit_card_processing_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netAmount"]);
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


export interface Credit_card_processing_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
