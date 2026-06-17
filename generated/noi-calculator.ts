// @ts-nocheck
// Auto-generated from noi-calculator-schema.json
import * as z from 'zod';

export interface Noi_calculatorInput {
  grossRentalIncome: number;
  vacancyLoss: number;
  propertyManagementFees: number;
  repairsMaintenance: number;
  propertyTaxes: number;
  insurance: number;
  utilities: number;
  otherOperatingExpenses: number;
}

export const Noi_calculatorInputSchema = z.object({
  grossRentalIncome: z.number().default(100000),
  vacancyLoss: z.number().default(5000),
  propertyManagementFees: z.number().default(8000),
  repairsMaintenance: z.number().default(6000),
  propertyTaxes: z.number().default(10000),
  insurance: z.number().default(4000),
  utilities: z.number().default(3000),
  otherOperatingExpenses: z.number().default(2000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Noi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.grossRentalIncome - input.vacancyLoss; results["effectiveGrossIncome"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveGrossIncome"] = 0; }
  try { const v = input.propertyManagementFees + input.repairsMaintenance + input.propertyTaxes + input.insurance + input.utilities + input.otherOperatingExpenses; results["totalOperatingExpenses"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalOperatingExpenses"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveGrossIncome"])) - (asFormulaNumber(results["totalOperatingExpenses"])); results["netOperatingIncome"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netOperatingIncome"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNoi_calculator(input: Noi_calculatorInput): Noi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netOperatingIncome"]);
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


export interface Noi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
