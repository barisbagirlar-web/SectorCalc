// Auto-generated from standard-form-line-calculator-schema.json
import * as z from 'zod';

export interface Standard_form_line_calculatorInput {
  A: number;
  B: number;
  C: number;
  x: number;
  dataConfidence?: number;
}

export const Standard_form_line_calculatorInputSchema = z.object({
  A: z.number().default(1),
  B: z.number().default(1),
  C: z.number().default(0),
  x: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Standard_form_line_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.C - input.A * input.x) / input.B; results["y"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["y"] = 0; }
  try { const v = -input.A / input.B; results["slope"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["slope"] = 0; }
  try { const v = input.C / input.A; results["x_intercept"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["x_intercept"] = 0; }
  try { const v = input.C / input.B; results["y_intercept"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["y_intercept"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStandard_form_line_calculator(input: Standard_form_line_calculatorInput): Standard_form_line_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["y"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Standard_form_line_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
