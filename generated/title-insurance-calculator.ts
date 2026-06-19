// Auto-generated from title-insurance-calculator-schema.json
import * as z from 'zod';

export interface Title_insurance_calculatorInput {
  propertyValue: number;
  coverageAmount: number;
  ratePerThousand: number;
  policyFee: number;
  stateTaxRate: number;
  dataConfidence?: number;
}

export const Title_insurance_calculatorInputSchema = z.object({
  propertyValue: z.number().default(300000),
  coverageAmount: z.number().default(300000),
  ratePerThousand: z.number().default(5),
  policyFee: z.number().default(150),
  stateTaxRate: z.number().default(0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Title_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverageAmount * (input.ratePerThousand / 1000); results["basePremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["basePremium"] = 0; }
  try { const v = (asFormulaNumber(results["basePremium"])) * input.stateTaxRate / 100; results["stateTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stateTax"] = 0; }
  try { const v = (asFormulaNumber(results["basePremium"])) + input.policyFee + (asFormulaNumber(results["stateTax"])); results["totalPremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPremium"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTitle_insurance_calculator(input: Title_insurance_calculatorInput): Title_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalPremium"]));
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


export interface Title_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
