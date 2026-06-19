// Auto-generated from social-security-early-retirement-calculator-schema.json
import * as z from 'zod';

export interface Social_security_early_retirement_calculatorInput {
  birthYear: number;
  earlyRetirementAge: number;
  monthlyBenefitAtFRA: number;
  scalingFactor: number;
  dataConfidence?: number;
}

export const Social_security_early_retirement_calculatorInputSchema = z.object({
  birthYear: z.number().default(1960),
  earlyRetirementAge: z.number().default(62),
  monthlyBenefitAtFRA: z.number().default(1500),
  scalingFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Social_security_early_retirement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birthYear; results["fullRetirementAge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fullRetirementAge"] = 0; }
  try { const v = input.birthYear; results["monthsEarly"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthsEarly"] = 0; }
  try { const v = input.birthYear; results["reductionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reductionFactor"] = 0; }
  try { const v = input.birthYear; results["reducedMonthlyBenefit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reducedMonthlyBenefit"] = 0; }
  try { const v = input.birthYear; results["reductionPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reductionPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSocial_security_early_retirement_calculator(input: Social_security_early_retirement_calculatorInput): Social_security_early_retirement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["reducedMonthlyBenefit"]);
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


export interface Social_security_early_retirement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
