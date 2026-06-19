// Auto-generated from renters-insurance-calculator-schema.json
import * as z from 'zod';

export interface Renters_insurance_calculatorInput {
  personalPropertyValue: number;
  liabilityCoverage: number;
  deductible: number;
  locationRiskFactor: number;
  securityDiscount: number;
  dataConfidence?: number;
}

export const Renters_insurance_calculatorInputSchema = z.object({
  personalPropertyValue: z.number().default(30000),
  liabilityCoverage: z.number().default(100000),
  deductible: z.number().default(1000),
  locationRiskFactor: z.number().default(1),
  securityDiscount: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Renters_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.personalPropertyValue * 0.01) + (input.liabilityCoverage * 0.002); results["totalBasePremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBasePremium"] = 0; }
  try { const v = (asFormulaNumber(results["totalBasePremium"])) * input.locationRiskFactor; results["riskAdjustedPremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riskAdjustedPremium"] = 0; }
  try { const v = (asFormulaNumber(results["riskAdjustedPremium"])) * (input.securityDiscount / 100); results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (asFormulaNumber(results["riskAdjustedPremium"])) - (asFormulaNumber(results["discountAmount"])); results["finalAnnualPremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalAnnualPremium"] = 0; }
  try { const v = (asFormulaNumber(results["finalAnnualPremium"])) / 12; results["monthlyPremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyPremium"] = 0; }
  try { const v = input.personalPropertyValue + input.liabilityCoverage; results["totalCoverage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCoverage"] = 0; }
  try { const v = input.deductible; results["deductible"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deductible"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRenters_insurance_calculator(input: Renters_insurance_calculatorInput): Renters_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["finalAnnualPremium"]));
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


export interface Renters_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
