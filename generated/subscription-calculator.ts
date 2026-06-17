// @ts-nocheck
// Auto-generated from subscription-calculator-schema.json
import * as z from 'zod';

export interface Subscription_calculatorInput {
  numberOfUsers: number;
  pricePerUser: number;
  durationMonths: number;
  discountPercent: number;
  taxPercent: number;
}

export const Subscription_calculatorInputSchema = z.object({
  numberOfUsers: z.number().default(1),
  pricePerUser: z.number().default(10),
  durationMonths: z.number().default(12),
  discountPercent: z.number().default(0),
  taxPercent: z.number().default(18),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Subscription_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.numberOfUsers * input.pricePerUser * input.durationMonths; results["subtotalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["subtotalCost"] = 0; }
  try { const v = (asFormulaNumber(results["subtotalCost"])) * (input.discountPercent / 100); results["discountAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = ((asFormulaNumber(results["subtotalCost"])) - (asFormulaNumber(results["discountAmount"]))) * (input.taxPercent / 100); results["taxAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotalCost"])) - (asFormulaNumber(results["discountAmount"])) + (asFormulaNumber(results["taxAmount"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSubscription_calculator(input: Subscription_calculatorInput): Subscription_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Subscription_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
