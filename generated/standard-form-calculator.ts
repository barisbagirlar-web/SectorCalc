// Auto-generated from standard-form-calculator-schema.json
import * as z from 'zod';

export interface Standard_form_calculatorInput {
  number: number;
  sigFig: number;
  notationMode: number;
  roundingMode: number;
  dataConfidence?: number;
}

export const Standard_form_calculatorInputSchema = z.object({
  number: z.number().default(0),
  sigFig: z.number().default(3),
  notationMode: z.number().default(0),
  roundingMode: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Standard_form_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.number * input.sigFig * input.notationMode * input.roundingMode; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.number * input.sigFig * input.notationMode * input.roundingMode; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateStandard_form_calculator(input: Standard_form_calculatorInput): Standard_form_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Standard_form_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
