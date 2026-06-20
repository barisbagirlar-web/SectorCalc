// Auto-generated from subscription-calculator-schema.json
import * as z from 'zod';

export interface Subscription_calculatorInput {
  numberOfUsers: number;
  pricePerUser: number;
  durationMonths: number;
  discountPercent: number;
  taxPercent: number;
  dataConfidence?: number;
}

export const Subscription_calculatorInputSchema = z.object({
  numberOfUsers: z.number().default(1),
  pricePerUser: z.number().default(10),
  durationMonths: z.number().default(12),
  discountPercent: z.number().default(0),
  taxPercent: z.number().default(18),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Subscription_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfUsers * input.pricePerUser * input.durationMonths; results["subtotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotalCost"])) * (input.discountPercent / 100); results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountAmount"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["subtotalCost"])) - (toNumericFormulaValue(results["discountAmount"]))) * (input.taxPercent / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotalCost"])) - (toNumericFormulaValue(results["discountAmount"])) + (toNumericFormulaValue(results["taxAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateSubscription_calculator(input: Subscription_calculatorInput): Subscription_calculatorOutput {
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


export interface Subscription_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
