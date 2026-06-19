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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wire_transfer_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flatFeeSender + (input.transferAmount * input.percentageFeeSender / 100) + (input.isInternational ? (input.flatFeeIntermediary + input.flatFeeReceiver) : 0); results["totalFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFee"] = 0; }
  try { const v = input.transferAmount + (asFormulaNumber(results["totalFee"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWire_transfer_fee_calculator(input: Wire_transfer_fee_calculatorInput): Wire_transfer_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
