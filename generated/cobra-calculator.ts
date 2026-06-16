// Auto-generated from cobra-calculator-schema.json
import * as z from 'zod';

export interface Cobra_calculatorInput {
  monthlyPremium: number;
  beneficiaries: number;
  adminFeeRate: number;
  coverageMonths: number;
  employerContributionRate: number;
}

export const Cobra_calculatorInputSchema = z.object({
  monthlyPremium: z.number().default(500),
  beneficiaries: z.number().default(1),
  adminFeeRate: z.number().default(2),
  coverageMonths: z.number().default(18),
  employerContributionRate: z.number().default(0),
});

function evaluateAllFormulas(input: Cobra_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyPremium * input.beneficiaries * input.coverageMonths; results["totalPremium"] = Number.isFinite(v) ? v : 0; } catch { results["totalPremium"] = 0; }
  try { const v = (results["totalPremium"] ?? 0) * input.adminFeeRate / 100; results["adminFeeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["adminFeeAmount"] = 0; }
  try { const v = (results["totalPremium"] ?? 0) + (results["adminFeeAmount"] ?? 0); results["totalCostWithoutContribution"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostWithoutContribution"] = 0; }
  try { const v = (results["totalCostWithoutContribution"] ?? 0) * input.employerContributionRate / 100; results["employerContributionAmount"] = Number.isFinite(v) ? v : 0; } catch { results["employerContributionAmount"] = 0; }
  try { const v = (results["totalCostWithoutContribution"] ?? 0) - (results["employerContributionAmount"] ?? 0); results["totalEmployeeCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalEmployeeCost"] = 0; }
  return results;
}


export function calculateCobra_calculator(input: Cobra_calculatorInput): Cobra_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalEmployeeCost"] ?? 0;
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


export interface Cobra_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
