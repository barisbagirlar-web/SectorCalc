// Auto-generated from capital-lease-calculator-schema.json
import * as z from 'zod';

export interface Capital_lease_calculatorInput {
  assetCost: number;
  leaseTerm: number;
  interestRate: number;
  residualValue: number;
  paymentFrequency: number;
  dataConfidence?: number;
}

export const Capital_lease_calculatorInputSchema = z.object({
  assetCost: z.number().default(100000),
  leaseTerm: z.number().default(5),
  interestRate: z.number().default(8),
  residualValue: z.number().default(20000),
  paymentFrequency: z.number().default(12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Capital_lease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.interestRate / 100) / input.paymentFrequency; results["r"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = input.leaseTerm * input.paymentFrequency; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCapital_lease_calculator(input: Capital_lease_calculatorInput): Capital_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["n"]);
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


export interface Capital_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
