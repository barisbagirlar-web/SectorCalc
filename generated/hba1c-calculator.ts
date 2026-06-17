// @ts-nocheck
// Auto-generated from hba1c-calculator-schema.json
import * as z from 'zod';

export interface Hba1c_calculatorInput {
  glucose: number;
  unit: number;
  confidence: number;
  measurementUncertainty: number;
}

export const Hba1c_calculatorInputSchema = z.object({
  glucose: z.number().default(120),
  unit: z.number().default(0),
  confidence: z.number().default(95),
  measurementUncertainty: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hba1c_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.unit == 0 ? input.glucose : input.glucose * 18.0182; results["eAG_mgdl"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["eAG_mgdl"] = 0; }
  try { const v = input.unit == 0 ? input.glucose / 18.0182 : input.glucose; results["eAG_mmol"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["eAG_mmol"] = 0; }
  try { const v = ((asFormulaNumber(results["eAG_mgdl"])) + 46.7) / 28.7; results["hba1cPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hba1cPercent"] = 0; }
  try { const v = 10.93 * (asFormulaNumber(results["eAG_mmol"])) - 23.5; results["hba1cMmolMol"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hba1cMmolMol"] = 0; }
  try { const v = (asFormulaNumber(results["hba1cPercent"])) * (1 - input.measurementUncertainty / 100); results["rangeLow"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rangeLow"] = 0; }
  try { const v = (asFormulaNumber(results["hba1cPercent"])) * (1 + input.measurementUncertainty / 100); results["rangeHigh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rangeHigh"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHba1c_calculator(input: Hba1c_calculatorInput): Hba1c_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hba1cPercent"]);
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


export interface Hba1c_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
