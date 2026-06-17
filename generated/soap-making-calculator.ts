// @ts-nocheck
// Auto-generated from soap-making-calculator-schema.json
import * as z from 'zod';

export interface Soap_making_calculatorInput {
  oilWeight: number;
  sapValue: number;
  superfat: number;
  waterPercent: number;
}

export const Soap_making_calculatorInputSchema = z.object({
  oilWeight: z.number().default(1000),
  sapValue: z.number().default(135.5),
  superfat: z.number().default(5),
  waterPercent: z.number().default(38),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Soap_making_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.oilWeight * input.sapValue / 1000) * (1 - input.superfat / 100); results["lyeWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lyeWeight"] = 0; }
  try { const v = input.oilWeight * (input.waterPercent / 100); results["waterWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["waterWeight"] = 0; }
  try { const v = input.oilWeight + (asFormulaNumber(results["lyeWeight"])) + (asFormulaNumber(results["waterWeight"])); results["totalWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSoap_making_calculator(input: Soap_making_calculatorInput): Soap_making_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lyeWeight"]);
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


export interface Soap_making_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
