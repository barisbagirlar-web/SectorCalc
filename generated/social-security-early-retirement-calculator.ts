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
  try { const v = input.birthYear * input.monthlyBenefitAtFRA; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.birthYear * input.monthlyBenefitAtFRA; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.birthYear * input.monthlyBenefitAtFRA; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSocial_security_early_retirement_calculator(input: Social_security_early_retirement_calculatorInput): Social_security_early_retirement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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


export interface Social_security_early_retirement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
