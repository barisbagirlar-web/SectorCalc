// @ts-nocheck
// Auto-generated from social-security-calculator-schema.json
import * as z from 'zod';

export interface Social_security_calculatorInput {
  monthlyGrossSalary: number;
  employeeRate: number;
  employerRate: number;
  capAmount: number;
}

export const Social_security_calculatorInputSchema = z.object({
  monthlyGrossSalary: z.number().default(5000),
  employeeRate: z.number().default(14),
  employerRate: z.number().default(20.5),
  capAmount: z.number().default(25000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Social_security_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.monthlyGrossSalary + input.employeeRate + input.employerRate; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.monthlyGrossSalary + input.employeeRate + input.employerRate; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSocial_security_calculator(input: Social_security_calculatorInput): Social_security_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Social_security_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
