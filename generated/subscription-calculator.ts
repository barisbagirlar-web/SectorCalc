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

function evaluateAllFormulas(input: Subscription_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfUsers * input.pricePerUser * input.durationMonths; results["subtotalCost"] = Number.isFinite(v) ? v : 0; } catch { results["subtotalCost"] = 0; }
  try { const v = (results["subtotalCost"] ?? 0) * (input.discountPercent / 100); results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = ((results["subtotalCost"] ?? 0) - (results["discountAmount"] ?? 0)) * (input.taxPercent / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["subtotalCost"] ?? 0) - (results["discountAmount"] ?? 0) + (results["taxAmount"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateSubscription_calculator(input: Subscription_calculatorInput): Subscription_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Subscription_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
