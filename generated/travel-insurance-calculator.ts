// Auto-generated from travel-insurance-calculator-schema.json
import * as z from 'zod';

export interface Travel_insurance_calculatorInput {
  tripDurationDays: number;
  travelerAge: number;
  coverageAmount: number;
  destinationRisk: number;
  deductible: number;
  numberOfTravelers: number;
  dataConfidence?: number;
}

export const Travel_insurance_calculatorInputSchema = z.object({
  tripDurationDays: z.number().default(7),
  travelerAge: z.number().default(35),
  coverageAmount: z.number().default(50000),
  destinationRisk: z.number().default(1),
  deductible: z.number().default(0),
  numberOfTravelers: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Travel_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + (input.travelerAge > 60 ? (input.travelerAge - 60) * 0.05 : 0); results["ageFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ageFactor"] = Number.NaN; }
  try { const v = input.destinationRisk; results["riskFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskFactor"] = Number.NaN; }
  try { const v = input.deductible * 0.01; results["deductibleDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deductibleDiscount"] = Number.NaN; }
  return results;
}


export function calculateTravel_insurance_calculator(input: Travel_insurance_calculatorInput): Travel_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deductibleDiscount"]);
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


export interface Travel_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
