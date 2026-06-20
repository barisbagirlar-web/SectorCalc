// Auto-generated from abc-classification-calculator-schema.json
import * as z from 'zod';

export interface Abc_classification_calculatorInput {
  annualDemand: number;
  unitCost: number;
  totalAnnualValue: number;
  cumulativeBefore: number;
  dataConfidence?: number;
}

export const Abc_classification_calculatorInputSchema = z.object({
  annualDemand: z.number().default(0),
  unitCost: z.number().default(0),
  totalAnnualValue: z.number().default(0),
  cumulativeBefore: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Abc_classification_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDemand * input.unitCost; results["annualValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualValue"] = Number.NaN; }
  try { const v = input.totalAnnualValue !== 0 ? ((toNumericFormulaValue(results["annualValue"])) / input.totalAnnualValue) * 100 : 0; results["percentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["percentage"] = Number.NaN; }
  try { const v = input.cumulativeBefore + (toNumericFormulaValue(results["percentage"])); results["cumulativeAfter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cumulativeAfter"] = Number.NaN; }
  return results;
}


export function calculateAbc_classification_calculator(input: Abc_classification_calculatorInput): Abc_classification_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cumulativeAfter"]);
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


export interface Abc_classification_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
