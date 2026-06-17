// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cost_benefit_analysis_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.discountRate / 100; results["rate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rate"] = 0; }
  try { const v = input.annualBenefits - input.annualCosts; results["netAnnualCash"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netAnnualCash"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCost_benefit_analysis_calculator(input: Cost_benefit_analysis_calculatorInput): Cost_benefit_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netAnnualCash"]);
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


export interface Cost_benefit_analysis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
