// @ts-nocheck
// Auto-generated from annual-return-calculator-schema.json
import * as z from 'zod';

export interface Annual_return_calculatorInput {
  initialInvestment: number;
  finalValue: number;
  years: number;
  inflationRate: number;
}

export const Annual_return_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  finalValue: z.number().default(15000),
  years: z.number().default(5),
  inflationRate: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Annual_return_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.finalValue / input.initialInvestment) ** (1 / input.years) - 1; results["nominalAnnualReturn"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["nominalAnnualReturn"] = 0; }
  try { const v = (1 + ((input.finalValue / input.initialInvestment) ** (1 / input.years) - 1)) / (1 + input.inflationRate / 100) - 1; results["realAnnualReturn"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["realAnnualReturn"] = 0; }
  try { const v = input.finalValue / input.initialInvestment; results["totalReturnMultiple"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalReturnMultiple"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAnnual_return_calculator(input: Annual_return_calculatorInput): Annual_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["nominalAnnualReturn"]);
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


export interface Annual_return_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
