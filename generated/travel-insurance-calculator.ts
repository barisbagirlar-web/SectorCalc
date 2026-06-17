// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Travel_insurance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 + (input.travelerAge > 60 ? (input.travelerAge - 60) * 0.05 : 0); results["ageFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ageFactor"] = 0; }
  try { const v = input.destinationRisk; results["riskFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["riskFactor"] = 0; }
  try { const v = input.deductible * 0.01; results["deductibleDiscount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deductibleDiscount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTravel_insurance_calculator(input: Travel_insurance_calculatorInput): Travel_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deductibleDiscount"]);
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


export interface Travel_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
