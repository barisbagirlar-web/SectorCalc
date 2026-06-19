// Auto-generated from moment-of-inertia-calculator-schema.json
import * as z from 'zod';

export interface Moment_of_inertia_calculatorInput {
  shape: number;
  dim1: number;
  dim2: number;
  dim3: number;
  dim4: number;
  dataConfidence?: number;
}

export const Moment_of_inertia_calculatorInputSchema = z.object({
  shape: z.number().default(1),
  dim1: z.number().default(100),
  dim2: z.number().default(200),
  dim3: z.number().default(10),
  dim4: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Moment_of_inertia_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shape==1 ? (input.dim1 * input.dim2**3)/12 : null; results["I_x_rectangle"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["I_x_rectangle"] = 0; }
  try { const v = input.shape==1 ? (input.dim2 * input.dim1**3)/12 : null; results["I_y_rectangle"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["I_y_rectangle"] = 0; }
  try { const v = input.shape==4 ? (input.dim1 * input.dim2**3 - (input.dim1 - input.dim4) * (input.dim2 - 2*input.dim3)**3)/12 : null; results["I_x_Ibeam"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["I_x_Ibeam"] = 0; }
  try { const v = input.shape==4 ? (2*input.dim3 * input.dim1**3 + (input.dim2 - 2*input.dim3) * input.dim4**3)/12 : null; results["I_y_Ibeam"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["I_y_Ibeam"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMoment_of_inertia_calculator(input: Moment_of_inertia_calculatorInput): Moment_of_inertia_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["I_x_rectangle"]));
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


export interface Moment_of_inertia_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
