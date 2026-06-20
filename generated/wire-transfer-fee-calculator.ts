// Auto-generated from wire-transfer-fee-calculator-schema.json
import * as z from 'zod';

export interface Wire_transfer_fee_calculatorInput {
  transferAmount: number;
  flatFeeSender: number;
  percentageFeeSender: number;
  flatFeeIntermediary: number;
  flatFeeReceiver: number;
  isInternational: number;
  dataConfidence?: number;
}

export const Wire_transfer_fee_calculatorInputSchema = z.object({
  transferAmount: z.number().default(1000),
  flatFeeSender: z.number().default(15),
  percentageFeeSender: z.number().default(0),
  flatFeeIntermediary: z.number().default(0),
  flatFeeReceiver: z.number().default(0),
  isInternational: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wire_transfer_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flatFeeSender + (input.transferAmount * input.percentageFeeSender / 100) + (input.isInternational ? (input.flatFeeIntermediary + input.flatFeeReceiver) : 0); results["totalFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFee"] = Number.NaN; }
  try { const v = input.transferAmount + (toNumericFormulaValue(results["totalFee"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateWire_transfer_fee_calculator(input: Wire_transfer_fee_calculatorInput): Wire_transfer_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Wire_transfer_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
