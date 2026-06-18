// @ts-nocheck
// Auto-generated from social-security-benefits-calculator-schema.json
import * as z from 'zod';

export interface Social_security_benefits_calculatorInput {
  monthlySalary: number;
  employeeRate: number;
  employerRate: number;
  ceiling: number;
}

export const Social_security_benefits_calculatorInputSchema = z.object({
  monthlySalary: z.number().default(5000),
  employeeRate: z.number().default(14),
  employerRate: z.number().default(20.5),
  ceiling: z.number().default(20000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Social_security_benefits_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1; results["annual_exposure_hours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.employeeRate * (input.employeeRate / 100) * 1 * input.monthlySalary; results["direct_labor_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.employeeRate * (input.employeeRate / 100) * 1 * input.monthlySalary; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSocial_security_benefits_calculator(input: Social_security_benefits_calculatorInput): Social_security_benefits_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
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


export interface Social_security_benefits_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
