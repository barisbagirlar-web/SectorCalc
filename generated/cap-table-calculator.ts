// @ts-nocheck
// Auto-generated from cap-table-calculator-schema.json
import * as z from 'zod';

export interface Cap_table_calculatorInput {
  totalAuthorizedShares: number;
  sharesOutstanding: number;
  optionPoolSize: number;
  newInvestment: number;
  preMoneyValuation: number;
}

export const Cap_table_calculatorInputSchema = z.object({
  totalAuthorizedShares: z.number().default(10000000),
  sharesOutstanding: z.number().default(5000000),
  optionPoolSize: z.number().default(500000),
  newInvestment: z.number().default(1000000),
  preMoneyValuation: z.number().default(10000000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cap_table_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.sharesOutstanding + input.optionPoolSize; results["fullyDilutedPre"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fullyDilutedPre"] = 0; }
  try { const v = input.preMoneyValuation / (asFormulaNumber(results["fullyDilutedPre"])); results["pricePerShare"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pricePerShare"] = 0; }
  try { const v = input.newInvestment / (asFormulaNumber(results["pricePerShare"])); results["newSharesIssued"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["newSharesIssued"] = 0; }
  try { const v = input.preMoneyValuation + input.newInvestment; results["postMoneyValuation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["postMoneyValuation"] = 0; }
  try { const v = (asFormulaNumber(results["fullyDilutedPre"])) + (asFormulaNumber(results["newSharesIssued"])); results["totalPostShares"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPostShares"] = 0; }
  try { const v = ((asFormulaNumber(results["newSharesIssued"])) / (asFormulaNumber(results["totalPostShares"]))) * 100; results["investorOwnershipPct"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["investorOwnershipPct"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCap_table_calculator(input: Cap_table_calculatorInput): Cap_table_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["investorOwnershipPct"]);
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


export interface Cap_table_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
