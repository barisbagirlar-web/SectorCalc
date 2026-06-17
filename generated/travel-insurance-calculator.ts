// Auto-generated from travel-insurance-calculator-schema.json
import * as z from 'zod';

export interface Travel_insurance_calculatorInput {
  tripDurationDays: number;
  travelerAge: number;
  coverageAmount: number;
  destinationRisk: number;
  deductible: number;
  numberOfTravelers: number;
}

export const Travel_insurance_calculatorInputSchema = z.object({
  tripDurationDays: z.number().default(7),
  travelerAge: z.number().default(35),
  coverageAmount: z.number().default(50000),
  destinationRisk: z.number().default(1),
  deductible: z.number().default(0),
  numberOfTravelers: z.number().default(1),
});

function evaluateAllFormulas(input: Travel_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 5; results["baseDailyRate"] = Number.isFinite(v) ? v : 0; } catch { results["baseDailyRate"] = 0; }
  try { const v = 1 + (input.travelerAge > 60 ? (input.travelerAge - 60) * 0.05 : 0); results["ageFactor"] = Number.isFinite(v) ? v : 0; } catch { results["ageFactor"] = 0; }
  try { const v = input.destinationRisk; results["riskFactor"] = Number.isFinite(v) ? v : 0; } catch { results["riskFactor"] = 0; }
  try { const v = input.tripDurationDays * (results["baseDailyRate"] ?? 0) * (results["riskFactor"] ?? 0) * (results["ageFactor"] ?? 0) * input.numberOfTravelers; results["premiumBeforeDeductible"] = Number.isFinite(v) ? v : 0; } catch { results["premiumBeforeDeductible"] = 0; }
  try { const v = input.deductible * 0.01; results["deductibleDiscount"] = Number.isFinite(v) ? v : 0; } catch { results["deductibleDiscount"] = 0; }
  try { const v = (results["baseDailyRate"] ?? 0) * (results["riskFactor"] ?? 0) * (results["ageFactor"] ?? 0) * input.numberOfTravelers; results["dailyCost"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = Math.max(0, (results["premiumBeforeDeductible"] ?? 0) - (results["deductibleDiscount"] ?? 0)); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateTravel_insurance_calculator(input: Travel_insurance_calculatorInput): Travel_insurance_calculatorOutput {
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


export interface Travel_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
