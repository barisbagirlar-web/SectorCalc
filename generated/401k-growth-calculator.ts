// Auto-generated from 401k-growth-calculator-schema.json
import * as z from 'zod';

export interface _401k_growth_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  annualContribution: number;
  salary: number;
  employerMatch: number;
  annualReturn: number;
  dataConfidence?: number;
}

export const _401k_growth_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentBalance: z.number().default(50000),
  annualContribution: z.number().default(10000),
  salary: z.number().default(100000),
  employerMatch: z.number().default(3),
  annualReturn: z.number().default(7),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _401k_growth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetire"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yearsToRetire"] = 0; }
  try { const v = input.salary * input.employerMatch / 100; results["matchAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["matchAmount"] = 0; }
  try { const v = input.annualContribution + (asFormulaNumber(results["matchAmount"])); results["totalAnnualAddition"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAnnualAddition"] = 0; }
  try { const v = input.annualContribution * (asFormulaNumber(results["yearsToRetire"])); results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (asFormulaNumber(results["matchAmount"])) * (asFormulaNumber(results["yearsToRetire"])); results["totalEmployerMatch"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEmployerMatch"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_401k_growth_calculator(input: _401k_growth_calculatorInput): _401k_growth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalEmployerMatch"]));
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


export interface _401k_growth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
