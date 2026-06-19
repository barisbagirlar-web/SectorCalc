// Auto-generated from degree-of-operating-leverage-calculator-schema.json
import * as z from 'zod';

export interface Degree_of_operating_leverage_calculatorInput {
  quantity: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  fixedCosts: number;
  dataConfidence?: number;
}

export const Degree_of_operating_leverage_calculatorInputSchema = z.object({
  quantity: z.number().default(1000),
  pricePerUnit: z.number().default(50),
  variableCostPerUnit: z.number().default(30),
  fixedCosts: z.number().default(10000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Degree_of_operating_leverage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pricePerUnit - input.variableCostPerUnit; results["contributionMarginPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["contributionMarginPerUnit"] = 0; }
  try { const v = input.quantity * (asFormulaNumber(results["contributionMarginPerUnit"])); results["totalContributionMargin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalContributionMargin"] = 0; }
  try { const v = (asFormulaNumber(results["totalContributionMargin"])) - input.fixedCosts; results["operatingIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["operatingIncome"] = 0; }
  try { const v = (asFormulaNumber(results["totalContributionMargin"])) / (asFormulaNumber(results["operatingIncome"])); results["degreeOfOperatingLeverage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["degreeOfOperatingLeverage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDegree_of_operating_leverage_calculator(input: Degree_of_operating_leverage_calculatorInput): Degree_of_operating_leverage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["degreeOfOperatingLeverage"]);
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


export interface Degree_of_operating_leverage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
