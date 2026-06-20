// Auto-generated from child-dose-calculator-schema.json
import * as z from 'zod';

export interface Child_dose_calculatorInput {
  adultDose: number;
  childAge: number;
  childWeight: number;
  childHeight: number;
  dataConfidence?: number;
}

export const Child_dose_calculatorInputSchema = z.object({
  adultDose: z.number().default(500),
  childAge: z.number().default(5),
  childWeight: z.number().default(20),
  childHeight: z.number().default(110),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Child_dose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.childWeight / 70) * input.adultDose; results["recommendedChildDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recommendedChildDose"] = Number.NaN; }
  try { const v = (input.childAge / (input.childAge + 12)) * input.adultDose; results["methodYoung"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["methodYoung"] = Number.NaN; }
  try { const v = ((input.childAge * 12) / 150) * input.adultDose; results["methodFried"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["methodFried"] = Number.NaN; }
  return results;
}


export function calculateChild_dose_calculator(input: Child_dose_calculatorInput): Child_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recommendedChildDose"]);
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


export interface Child_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
