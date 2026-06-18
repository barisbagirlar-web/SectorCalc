// @ts-nocheck
// Auto-generated from operating-lease-calculator-schema.json
import * as z from 'zod';

export interface Operating_lease_calculatorInput {
  assetCost: number;
  residualValue: number;
  leaseTerm: number;
  interestRate: number;
}

export const Operating_lease_calculatorInputSchema = z.object({
  assetCost: z.number().default(50000),
  residualValue: z.number().default(10000),
  leaseTerm: z.number().default(36),
  interestRate: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Operating_lease_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.assetCost - input.residualValue; results["depreciation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["depreciation"] = 0; }
  try { const v = (asFormulaNumber(results["depreciation"])) / input.leaseTerm; results["monthlyDepreciation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyDepreciation"] = 0; }
  try { const v = (input.assetCost - input.residualValue) * (asFormulaNumber(results["monthlyInterestRate"])); results["monthlyInterest"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInterest"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyDepreciation"])) + (asFormulaNumber(results["monthlyInterest"])); results["monthlyLeasePayment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyLeasePayment"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyLeasePayment"])) * input.leaseTerm; results["totalLeaseCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLeaseCost"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyInterest"])) * input.leaseTerm; results["totalInterest"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOperating_lease_calculator(input: Operating_lease_calculatorInput): Operating_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyLeasePayment"]);
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


export interface Operating_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
