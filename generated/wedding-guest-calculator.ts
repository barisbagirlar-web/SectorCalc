// Auto-generated from wedding-guest-calculator-schema.json
import * as z from 'zod';

export interface Wedding_guest_calculatorInput {
  guestCount: number;
  costPerPlate: number;
  venueCost: number;
  decorationCost: number;
  entertainmentCost: number;
  miscPercent: number;
}

export const Wedding_guest_calculatorInputSchema = z.object({
  guestCount: z.number().default(100),
  costPerPlate: z.number().default(50),
  venueCost: z.number().default(2000),
  decorationCost: z.number().default(1500),
  entertainmentCost: z.number().default(3000),
  miscPercent: z.number().default(10),
});

function evaluateAllFormulas(input: Wedding_guest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.venueCost + input.decorationCost + input.entertainmentCost + (input.costPerPlate * input.guestCount); results["baseCost"] = Number.isFinite(v) ? v : 0; } catch { results["baseCost"] = 0; }
  try { const v = (results["baseCost"] ?? 0) * (input.miscPercent / 100); results["miscAmount"] = Number.isFinite(v) ? v : 0; } catch { results["miscAmount"] = 0; }
  try { const v = (results["baseCost"] ?? 0) + (results["miscAmount"] ?? 0); results["totalWeddingBudget"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeddingBudget"] = 0; }
  try { const v = (results["totalWeddingBudget"] ?? 0) / input.guestCount; results["costPerGuest"] = Number.isFinite(v) ? v : 0; } catch { results["costPerGuest"] = 0; }
  return results;
}


export function calculateWedding_guest_calculator(input: Wedding_guest_calculatorInput): Wedding_guest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeddingBudget"] ?? 0;
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


export interface Wedding_guest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
