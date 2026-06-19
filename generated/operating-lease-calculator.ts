// Auto-generated from operating-lease-calculator-schema.json
import * as z from 'zod';

export interface Operating_lease_calculatorInput {
  assetCost: number;
  residualValue: number;
  leaseTerm: number;
  interestRate: number;
  dataConfidence?: number;
}

export const Operating_lease_calculatorInputSchema = z.object({
  assetCost: z.number().default(50000),
  residualValue: z.number().default(10000),
  leaseTerm: z.number().default(36),
  interestRate: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Operating_lease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOperating_lease_calculator(input: Operating_lease_calculatorInput): Operating_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyInterestRate_aux"]);
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


export interface Operating_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
