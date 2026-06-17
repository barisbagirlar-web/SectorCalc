// @ts-nocheck
// Auto-generated from child-dose-calculator-schema.json
import * as z from 'zod';

export interface Child_dose_calculatorInput {
  adultDose: number;
  childAge: number;
  childWeight: number;
  childHeight: number;
}

export const Child_dose_calculatorInputSchema = z.object({
  adultDose: z.number().default(500),
  childAge: z.number().default(5),
  childWeight: z.number().default(20),
  childHeight: z.number().default(110),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Child_dose_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.childWeight / 70) * input.adultDose; results["recommendedChildDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recommendedChildDose"] = 0; }
  try { const v = (input.childAge / (input.childAge + 12)) * input.adultDose; results["methodYoung"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["methodYoung"] = 0; }
  try { const v = ((input.childAge * 12) / 150) * input.adultDose; results["methodFried"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["methodFried"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateChild_dose_calculator(input: Child_dose_calculatorInput): Child_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recommendedChildDose"]);
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


export interface Child_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
