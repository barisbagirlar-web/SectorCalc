// Auto-generated from nominal-interest-rate-calculator-schema.json
import * as z from 'zod';

export interface Nominal_interest_rate_calculatorInput {
  realRate: number;
  inflationRate: number;
  taxRate: number;
  feePercentage: number;
  dataConfidence?: number;
}

export const Nominal_interest_rate_calculatorInputSchema = z.object({
  realRate: z.number().default(2),
  inflationRate: z.number().default(3),
  taxRate: z.number().default(25),
  feePercentage: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nominal_interest_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.realRate / 100; results["realDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["realDecimal"] = Number.NaN; }
  try { const v = input.inflationRate / 100; results["inflDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inflDecimal"] = Number.NaN; }
  try { const v = input.taxRate / 100; results["taxDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxDecimal"] = Number.NaN; }
  try { const v = input.feePercentage / 100; results["feeDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feeDecimal"] = Number.NaN; }
  try { const v = (1 + (toNumericFormulaValue(results["realDecimal"]))) * (1 + (toNumericFormulaValue(results["inflDecimal"]))) - 1; results["nominalDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nominalDecimal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["nominalDecimal"])) * 100; results["nominalRatePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nominalRatePercent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["nominalDecimal"])) * (1 - (toNumericFormulaValue(results["taxDecimal"]))); results["afterTaxDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterTaxDecimal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["afterTaxDecimal"])) * 100; results["afterTaxRatePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterTaxRatePercent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["afterTaxDecimal"])) - (toNumericFormulaValue(results["feeDecimal"])); results["afterFeesDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterFeesDecimal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["afterFeesDecimal"])) * 100; results["afterFeesRatePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterFeesRatePercent"] = Number.NaN; }
  return results;
}


export function calculateNominal_interest_rate_calculator(input: Nominal_interest_rate_calculatorInput): Nominal_interest_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["afterFeesRatePercent"]);
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


export interface Nominal_interest_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
