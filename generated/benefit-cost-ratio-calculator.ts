// Auto-generated from benefit-cost-ratio-calculator-schema.json
import * as z from 'zod';

export interface Benefit_cost_ratio_calculatorInput {
  initialCost: number;
  annualBenefits: number;
  annualCosts: number;
  projectLife: number;
  discountRate: number;
}

export const Benefit_cost_ratio_calculatorInputSchema = z.object({
  initialCost: z.number().default(100000),
  annualBenefits: z.number().default(30000),
  annualCosts: z.number().default(5000),
  projectLife: z.number().default(10),
  discountRate: z.number().default(8),
});

function evaluateAllFormulas(input: Benefit_cost_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.discountRate / 100; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = (1 - Math.pow(1 + (results["r"] ?? 0), -input.projectLife)) / (results["r"] ?? 0); results["pvAnnuityFactor"] = Number.isFinite(v) ? v : 0; } catch { results["pvAnnuityFactor"] = 0; }
  try { const v = input.annualBenefits * (results["pvAnnuityFactor"] ?? 0); results["pvBenefits"] = Number.isFinite(v) ? v : 0; } catch { results["pvBenefits"] = 0; }
  try { const v = input.annualCosts * (results["pvAnnuityFactor"] ?? 0); results["pvAnnualCosts"] = Number.isFinite(v) ? v : 0; } catch { results["pvAnnualCosts"] = 0; }
  try { const v = input.initialCost + (results["pvAnnualCosts"] ?? 0); results["totalPVcosts"] = Number.isFinite(v) ? v : 0; } catch { results["totalPVcosts"] = 0; }
  try { const v = (results["pvBenefits"] ?? 0) / (results["totalPVcosts"] ?? 0); results["benefitCostRatio"] = Number.isFinite(v) ? v : 0; } catch { results["benefitCostRatio"] = 0; }
  return results;
}


export function calculateBenefit_cost_ratio_calculator(input: Benefit_cost_ratio_calculatorInput): Benefit_cost_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["benefitCostRatio"] ?? 0;
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


export interface Benefit_cost_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
