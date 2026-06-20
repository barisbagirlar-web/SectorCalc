// Auto-generated from equity-dilution-calculator-schema.json
import * as z from 'zod';

export interface Equity_dilution_calculatorInput {
  totalOutstandingShares: number;
  newSharesIssued: number;
  investorCurrentShares: number;
  investorNewShares: number;
  dataConfidence?: number;
}

export const Equity_dilution_calculatorInputSchema = z.object({
  totalOutstandingShares: z.number().default(1000000),
  newSharesIssued: z.number().default(200000),
  investorCurrentShares: z.number().default(100000),
  investorNewShares: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Equity_dilution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalOutstandingShares + input.newSharesIssued; results["totalAfter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAfter"] = Number.NaN; }
  try { const v = input.investorCurrentShares + input.investorNewShares; results["investorTotalAfter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["investorTotalAfter"] = Number.NaN; }
  try { const v = input.investorCurrentShares / input.totalOutstandingShares; results["ownershipBefore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ownershipBefore"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["investorTotalAfter"])) / (toNumericFormulaValue(results["totalAfter"])); results["ownershipAfter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ownershipAfter"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["ownershipBefore"])) - (toNumericFormulaValue(results["ownershipAfter"]))) / (toNumericFormulaValue(results["ownershipBefore"]))) * 100; results["dilutionPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dilutionPercent"] = Number.NaN; }
  return results;
}


export function calculateEquity_dilution_calculator(input: Equity_dilution_calculatorInput): Equity_dilution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dilutionPercent"]);
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


export interface Equity_dilution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
