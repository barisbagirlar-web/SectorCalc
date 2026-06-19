// Auto-generated from home-insurance-calculator-schema.json
import * as z from 'zod';

export interface Home_insurance_calculatorInput {
  homeValue: number;
  coverageAmount: number;
  deductible: number;
  locationRisk: number;
  homeAge: number;
  safetyDiscount: number;
  dataConfidence?: number;
}

export const Home_insurance_calculatorInputSchema = z.object({
  homeValue: z.number().default(500000),
  coverageAmount: z.number().default(400000),
  deductible: z.number().default(1000),
  locationRisk: z.number().default(1),
  homeAge: z.number().default(5),
  safetyDiscount: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Home_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverageAmount * input.locationRisk * (1 + input.homeAge * 0.01); results["basePremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["basePremium"] = 0; }
  try { const v = (asFormulaNumber(results["basePremium"])) * input.safetyDiscount / 100; results["safetyDiscountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safetyDiscountAmount"] = 0; }
  try { const v = (asFormulaNumber(results["basePremium"])) - (asFormulaNumber(results["safetyDiscountAmount"])); results["finalPremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalPremium"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHome_insurance_calculator(input: Home_insurance_calculatorInput): Home_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["finalPremium"]));
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


export interface Home_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
