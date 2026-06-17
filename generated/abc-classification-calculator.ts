// @ts-nocheck
// Auto-generated from abc-classification-calculator-schema.json
import * as z from 'zod';

export interface Abc_classification_calculatorInput {
  annualDemand: number;
  unitCost: number;
  totalAnnualValue: number;
  cumulativeBefore: number;
}

export const Abc_classification_calculatorInputSchema = z.object({
  annualDemand: z.number().default(0),
  unitCost: z.number().default(0),
  totalAnnualValue: z.number().default(0),
  cumulativeBefore: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Abc_classification_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annualDemand * input.unitCost; results["annualValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualValue"] = 0; }
  try { const v = input.totalAnnualValue !== 0 ? ((asFormulaNumber(results["annualValue"])) / input.totalAnnualValue) * 100 : 0; results["percentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["percentage"] = 0; }
  try { const v = input.cumulativeBefore + (asFormulaNumber(results["percentage"])); results["cumulativeAfter"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cumulativeAfter"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAbc_classification_calculator(input: Abc_classification_calculatorInput): Abc_classification_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cumulativeAfter"]);
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


export interface Abc_classification_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
