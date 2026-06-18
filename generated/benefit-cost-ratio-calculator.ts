// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Benefit_cost_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.discountRate / 100; results["r"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["r"] = 0; }
  try { const v = input.annualBenefits * (1 - (1 + (asFormulaNumber(results["r"])))^(-input.projectLife)) / (asFormulaNumber(results["r"])); results["pvBenefits"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pvBenefits"] = 0; }
  try { const v = input.annualCosts * (1 - (1 + (asFormulaNumber(results["r"])))^(-input.projectLife)) / (asFormulaNumber(results["r"])); results["pvCosts"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pvCosts"] = 0; }
  try { const v = input.initialCost + (asFormulaNumber(results["pvCosts"])); results["totalPVcosts"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPVcosts"] = 0; }
  try { const v = (asFormulaNumber(results["pvBenefits"])) / (asFormulaNumber(results["totalPVcosts"])); results["benefitCostRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["benefitCostRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBenefit_cost_ratio_calculator(input: Benefit_cost_ratio_calculatorInput): Benefit_cost_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["benefitCostRatio"]);
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


export interface Benefit_cost_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
