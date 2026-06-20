// Auto-generated from cap-table-calculator-schema.json
import * as z from 'zod';

export interface Cap_table_calculatorInput {
  totalAuthorizedShares: number;
  sharesOutstanding: number;
  optionPoolSize: number;
  newInvestment: number;
  preMoneyValuation: number;
  dataConfidence?: number;
}

export const Cap_table_calculatorInputSchema = z.object({
  totalAuthorizedShares: z.number().default(10000000),
  sharesOutstanding: z.number().default(5000000),
  optionPoolSize: z.number().default(500000),
  newInvestment: z.number().default(1000000),
  preMoneyValuation: z.number().default(10000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cap_table_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sharesOutstanding + input.optionPoolSize; results["fullyDilutedPre"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fullyDilutedPre"] = Number.NaN; }
  try { const v = input.preMoneyValuation / (toNumericFormulaValue(results["fullyDilutedPre"])); results["pricePerShare"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pricePerShare"] = Number.NaN; }
  try { const v = input.newInvestment / (toNumericFormulaValue(results["pricePerShare"])); results["newSharesIssued"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newSharesIssued"] = Number.NaN; }
  try { const v = input.preMoneyValuation + input.newInvestment; results["postMoneyValuation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["postMoneyValuation"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fullyDilutedPre"])) + (toNumericFormulaValue(results["newSharesIssued"])); results["totalPostShares"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPostShares"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["newSharesIssued"])) / (toNumericFormulaValue(results["totalPostShares"]))) * 100; results["investorOwnershipPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["investorOwnershipPct"] = Number.NaN; }
  return results;
}


export function calculateCap_table_calculator(input: Cap_table_calculatorInput): Cap_table_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["investorOwnershipPct"]);
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


export interface Cap_table_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
