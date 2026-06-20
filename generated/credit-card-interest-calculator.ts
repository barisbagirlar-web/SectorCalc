// Auto-generated from credit-card-interest-calculator-schema.json
import * as z from 'zod';

export interface Credit_card_interest_calculatorInput {
  outstandingBalance: number;
  annualPercentageRate: number;
  billingDays: number;
  minimumPaymentPercent: number;
  dataConfidence?: number;
}

export const Credit_card_interest_calculatorInputSchema = z.object({
  outstandingBalance: z.number().default(1000),
  annualPercentageRate: z.number().default(18),
  billingDays: z.number().default(30),
  minimumPaymentPercent: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Credit_card_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualPercentageRate / (100 * 365); results["dailyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyRate"] = Number.NaN; }
  try { const v = input.outstandingBalance * ((1 + (input.annualPercentageRate / (100 * 365))) ** input.billingDays - 1); results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInterest"] = Number.NaN; }
  try { const v = input.outstandingBalance + (input.outstandingBalance * ((1 + (input.annualPercentageRate / (100 * 365))) ** input.billingDays - 1)); results["newBalance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newBalance"] = Number.NaN; }
  try { const v = input.outstandingBalance * input.minimumPaymentPercent / 100; results["minimumPaymentAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["minimumPaymentAmount"] = Number.NaN; }
  return results;
}


export function calculateCredit_card_interest_calculator(input: Credit_card_interest_calculatorInput): Credit_card_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalInterest"]);
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


export interface Credit_card_interest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
