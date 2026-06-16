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

function evaluateAllFormulas(input: Social_security_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(input.monthlyGrossSalary, input.capAmount); results["cappedSalary"] = Number.isFinite(v) ? v : 0; } catch { results["cappedSalary"] = 0; }
  try { const v = (results["cappedSalary"] ?? 0) * input.employeeRate / 100; results["employeeContribution"] = Number.isFinite(v) ? v : 0; } catch { results["employeeContribution"] = 0; }
  try { const v = (results["cappedSalary"] ?? 0) * input.employerRate / 100; results["employerContribution"] = Number.isFinite(v) ? v : 0; } catch { results["employerContribution"] = 0; }
  try { const v = (results["employeeContribution"] ?? 0) + (results["employerContribution"] ?? 0); results["toplamSGKPrimi"] = Number.isFinite(v) ? v : 0; } catch { results["toplamSGKPrimi"] = 0; }
  return results;
}


export function calculateSocial_security_calculator(input: Social_security_calculatorInput): Social_security_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["toplamSGKPrimi"] ?? 0;
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


export interface Social_security_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
