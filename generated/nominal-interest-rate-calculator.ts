// @ts-nocheck
// Auto-generated from nominal-interest-rate-calculator-schema.json
import * as z from 'zod';

export interface Nominal_interest_rate_calculatorInput {
  realRate: number;
  inflationRate: number;
  taxRate: number;
  feePercentage: number;
}

export const Nominal_interest_rate_calculatorInputSchema = z.object({
  realRate: z.number().default(2),
  inflationRate: z.number().default(3),
  taxRate: z.number().default(25),
  feePercentage: z.number().default(0.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Nominal_interest_rate_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.realRate / 100; results["realDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["realDecimal"] = 0; }
  try { const v = input.inflationRate / 100; results["inflDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["inflDecimal"] = 0; }
  try { const v = input.taxRate / 100; results["taxDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxDecimal"] = 0; }
  try { const v = input.feePercentage / 100; results["feeDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["feeDecimal"] = 0; }
  try { const v = (1 + (asFormulaNumber(results["realDecimal"]))) * (1 + (asFormulaNumber(results["inflDecimal"]))) - 1; results["nominalDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["nominalDecimal"] = 0; }
  try { const v = (asFormulaNumber(results["nominalDecimal"])) * 100; results["nominalRatePercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["nominalRatePercent"] = 0; }
  try { const v = (asFormulaNumber(results["nominalDecimal"])) * (1 - (asFormulaNumber(results["taxDecimal"]))); results["afterTaxDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["afterTaxDecimal"] = 0; }
  try { const v = (asFormulaNumber(results["afterTaxDecimal"])) * 100; results["afterTaxRatePercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["afterTaxRatePercent"] = 0; }
  try { const v = (asFormulaNumber(results["afterTaxDecimal"])) - (asFormulaNumber(results["feeDecimal"])); results["afterFeesDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["afterFeesDecimal"] = 0; }
  try { const v = (asFormulaNumber(results["afterFeesDecimal"])) * 100; results["afterFeesRatePercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["afterFeesRatePercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNominal_interest_rate_calculator(input: Nominal_interest_rate_calculatorInput): Nominal_interest_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["afterFeesRatePercent"]);
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


export interface Nominal_interest_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
