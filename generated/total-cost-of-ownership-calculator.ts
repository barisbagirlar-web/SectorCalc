// Auto-generated from total-cost-of-ownership-calculator-schema.json
import * as z from 'zod';

export interface Total_cost_of_ownership_calculatorInput {
  purchasePrice: number;
  annualMaintenance: number;
  annualEnergy: number;
  resaleValue: number;
  ownershipYears: number;
  discountRate: number;
  dataConfidence?: number;
}

export const Total_cost_of_ownership_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(10000),
  annualMaintenance: z.number().default(200),
  annualEnergy: z.number().default(500),
  resaleValue: z.number().default(3000),
  ownershipYears: z.number().default(5),
  discountRate: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Total_cost_of_ownership_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + (input.annualMaintenance + input.annualEnergy) * input.ownershipYears - input.resaleValue; results["totalUndiscounted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUndiscounted"] = Number.NaN; }
  try { const v = input.discountRate / 100; results["r"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["r"] = Number.NaN; }
  try { const v = input.purchasePrice + (input.annualMaintenance + input.annualEnergy) * ((1 - (1 + input.discountRate/100) ** (-input.ownershipYears)) / (input.discountRate/100)) - input.resaleValue * (1 + input.discountRate/100) ** (-input.ownershipYears); results["netPresentValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netPresentValue"] = Number.NaN; }
  return results;
}


export function calculateTotal_cost_of_ownership_calculator(input: Total_cost_of_ownership_calculatorInput): Total_cost_of_ownership_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netPresentValue"]);
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


export interface Total_cost_of_ownership_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
