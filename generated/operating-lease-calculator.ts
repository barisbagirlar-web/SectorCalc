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
  try { const v = input.assetCost - input.residualValue; results["depreciableBase"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["depreciableBase"] = 0; }
  try { const v = (asFormulaNumber(results["depreciableBase"])) / input.leaseTerm; results["monthlyDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyDepreciation"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyDepreciation"])) + ((asFormulaNumber(results["depreciableBase"])) * (asFormulaNumber(results["monthlyInterestRate"]))); results["monthlyLeasePayment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyLeasePayment"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyLeasePayment"])) * input.leaseTerm; results["totalLeaseCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLeaseCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalLeaseCost"])) - (asFormulaNumber(results["depreciableBase"])); results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOperating_lease_calculator(input: Operating_lease_calculatorInput): Operating_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["monthlyLeasePayment"]));
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


export interface Operating_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
