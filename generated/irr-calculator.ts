// @ts-nocheck
// Auto-generated from irr-calculator-schema.json
import * as z from 'zod';

export interface Irr_calculatorInput {
  initialInvestment: number;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  year5: number;
  guess: number;
}

export const Irr_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(-1000),
  year1: z.number().default(300),
  year2: z.number().default(400),
  year3: z.number().default(500),
  year4: z.number().default(500),
  year5: z.number().default(400),
  guess: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Irr_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.initialInvestment + input.year1 + input.year2; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.initialInvestment + input.year1 + input.year2; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateIrr_calculator(input: Irr_calculatorInput): Irr_calculatorOutput {
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
    premiumFeatures: [],
  };
}


export interface Irr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
