// Auto-generated from soap-making-calculator-schema.json
import * as z from 'zod';

export interface Soap_making_calculatorInput {
  oilWeight: number;
  sapValue: number;
  superfat: number;
  waterPercent: number;
  dataConfidence?: number;
}

export const Soap_making_calculatorInputSchema = z.object({
  oilWeight: z.number().default(1000),
  sapValue: z.number().default(135.5),
  superfat: z.number().default(5),
  waterPercent: z.number().default(38),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Soap_making_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.oilWeight * input.sapValue / 1000) * (1 - input.superfat / 100); results["lyeWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lyeWeight"] = Number.NaN; }
  try { const v = input.oilWeight * (input.waterPercent / 100); results["waterWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterWeight"] = Number.NaN; }
  try { const v = input.oilWeight + (toNumericFormulaValue(results["lyeWeight"])) + (toNumericFormulaValue(results["waterWeight"])); results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  return results;
}


export function calculateSoap_making_calculator(input: Soap_making_calculatorInput): Soap_making_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lyeWeight"]);
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


export interface Soap_making_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
