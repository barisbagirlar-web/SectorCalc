// Auto-generated from cost-benefit-analysis-calculator-schema.json
import * as z from 'zod';

export interface Cost_benefit_analysis_calculatorInput {
  initialInvestment: number;
  annualBenefits: number;
  annualCosts: number;
  discountRate: number;
  projectLifetime: number;
  salvageValue: number;
}

export const Cost_benefit_analysis_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(0),
  annualBenefits: z.number().default(0),
  annualCosts: z.number().default(0),
  discountRate: z.number().default(10),
  projectLifetime: z.number().default(5),
  salvageValue: z.number().default(0),
});

function evaluateAllFormulas(input: Cost_benefit_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.discountRate / 100; results["rate"] = Number.isFinite(v) ? v : 0; } catch { results["rate"] = 0; }
  try { const v = (1 - Math.pow(1 + (results["rate"] ?? 0), -input.projectLifetime)) / (results["rate"] ?? 0); results["annuityFactor"] = Number.isFinite(v) ? v : 0; } catch { results["annuityFactor"] = 0; }
  try { const v = input.annualBenefits - input.annualCosts; results["netAnnualCash"] = Number.isFinite(v) ? v : 0; } catch { results["netAnnualCash"] = 0; }
  try { const v = input.annualBenefits * (results["annuityFactor"] ?? 0) + input.salvageValue / Math.pow(1 + (results["rate"] ?? 0), input.projectLifetime); results["presentValueBenefits"] = Number.isFinite(v) ? v : 0; } catch { results["presentValueBenefits"] = 0; }
  try { const v = input.initialInvestment + input.annualCosts * (results["annuityFactor"] ?? 0); results["presentValueCosts"] = Number.isFinite(v) ? v : 0; } catch { results["presentValueCosts"] = 0; }
  try { const v = -input.initialInvestment + (results["netAnnualCash"] ?? 0) * (results["annuityFactor"] ?? 0) + input.salvageValue / Math.pow(1 + (results["rate"] ?? 0), input.projectLifetime); results["npv"] = Number.isFinite(v) ? v : 0; } catch { results["npv"] = 0; }
  try { const v = (results["presentValueBenefits"] ?? 0) / (results["presentValueCosts"] ?? 0); results["bcr"] = Number.isFinite(v) ? v : 0; } catch { results["bcr"] = 0; }
  return results;
}


export function calculateCost_benefit_analysis_calculator(input: Cost_benefit_analysis_calculatorInput): Cost_benefit_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["npv"] ?? 0;
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


export interface Cost_benefit_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
