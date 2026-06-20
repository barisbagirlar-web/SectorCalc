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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Renters_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.personalPropertyValue * 0.01) + (input.liabilityCoverage * 0.002); results["totalBasePremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBasePremium"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalBasePremium"])) * input.locationRiskFactor; results["riskAdjustedPremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskAdjustedPremium"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["riskAdjustedPremium"])) * (input.securityDiscount / 100); results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["riskAdjustedPremium"])) - (toNumericFormulaValue(results["discountAmount"])); results["finalAnnualPremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalAnnualPremium"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["finalAnnualPremium"])) / 12; results["monthlyPremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPremium"] = Number.NaN; }
  try { const v = input.personalPropertyValue + input.liabilityCoverage; results["totalCoverage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCoverage"] = Number.NaN; }
  try { const v = input.deductible; results["deductible"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deductible"] = Number.NaN; }
  return results;
}


export function calculateRenters_insurance_calculator(input: Renters_insurance_calculatorInput): Renters_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalAnnualPremium"]);
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


export interface Renters_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
