// Auto-generated from home-insurance-calculator-schema.json
import * as z from 'zod';

export interface Home_insurance_calculatorInput {
  homeValue: number;
  coverageAmount: number;
  deductible: number;
  locationRisk: number;
  homeAge: number;
  safetyDiscount: number;
}

export const Home_insurance_calculatorInputSchema = z.object({
  homeValue: z.number().default(500000),
  coverageAmount: z.number().default(400000),
  deductible: z.number().default(1000),
  locationRisk: z.number().default(1),
  homeAge: z.number().default(5),
  safetyDiscount: z.number().default(10),
});

function evaluateAllFormulas(input: Home_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverageAmount * input.locationRisk * (1 + input.homeAge * 0.01); results["basePremium"] = Number.isFinite(v) ? v : 0; } catch { results["basePremium"] = 0; }
  try { const v = (results["basePremium"] ?? 0) * input.safetyDiscount / 100; results["safetyDiscountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["safetyDiscountAmount"] = 0; }
  try { const v = (results["basePremium"] ?? 0) - (results["safetyDiscountAmount"] ?? 0); results["finalPremium"] = Number.isFinite(v) ? v : 0; } catch { results["finalPremium"] = 0; }
  return results;
}


export function calculateHome_insurance_calculator(input: Home_insurance_calculatorInput): Home_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalPremium"] ?? 0;
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


export interface Home_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
