// @ts-nocheck
// Auto-generated from apy-calculator-schema.json
import * as z from 'zod';

export interface Apy_calculatorInput {
  nominal_rate: number;
  compounding_frequency: string;
  time_period_years: number;
  initial_principal: number;
  fee_percentage: number;
  inflation_rate: number;
  tax_rate: number;
  is_continuous_compounding: boolean;
}

export const Apy_calculatorInputSchema = z.object({
  nominal_rate: z.number().min(0).max(100).default(5),
  compounding_frequency: z.enum(['1', '2', '4', '12', '52', '365']).default('12'),
  time_period_years: z.number().min(0.0833).max(100).default(1),
  initial_principal: z.number().min(0).max(100000000).default(10000),
  fee_percentage: z.number().min(0).max(10).default(0.5),
  inflation_rate: z.number().min(0).max(20).default(2),
  tax_rate: z.number().min(0).max(50).default(15),
  is_continuous_compounding: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Apy_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.nominal_rate + input.compounding_frequency + input.time_period_years; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.nominal_rate + input.compounding_frequency + input.time_period_years; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateApy_calculator(input: Apy_calculatorInput): Apy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-period comparison","Automated report generation"],
  };
}


export interface Apy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
