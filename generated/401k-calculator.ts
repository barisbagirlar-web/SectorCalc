// Auto-generated from 401k-calculator-schema.json
import * as z from 'zod';

export interface _401k_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  contributionRate: number;
  employerMatchRate: number;
  expectedReturnRate: number;
  inflationRate: number;
  currentBalance: number;
  dataConfidence?: number;
}

export const _401k_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentSalary: z.number().default(50000),
  contributionRate: z.number().default(10),
  employerMatchRate: z.number().default(5),
  expectedReturnRate: z.number().default(7),
  inflationRate: z.number().default(2),
  currentBalance: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _401k_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentAge * input.currentSalary; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.currentAge * input.currentSalary * (1 + (input.contributionRate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.currentAge * input.currentSalary * (1 + (input.contributionRate / 100)) * (input.retirementAge); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.retirementAge; results["factor_retirementAge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_retirementAge"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_401k_calculator(input: _401k_calculatorInput): _401k_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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


export interface _401k_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
