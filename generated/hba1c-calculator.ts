// Auto-generated from hba1c-calculator-schema.json
import * as z from 'zod';

export interface Hba1c_calculatorInput {
  glucose: number;
  unit: number;
  confidence: number;
  measurementUncertainty: number;
  dataConfidence?: number;
}

export const Hba1c_calculatorInputSchema = z.object({
  glucose: z.number().default(120),
  unit: z.number().default(0),
  confidence: z.number().default(95),
  measurementUncertainty: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hba1c_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.unit == 0 ? input.glucose : input.glucose * 18.0182; results["eAG_mgdl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eAG_mgdl"] = Number.NaN; }
  try { const v = input.unit == 0 ? input.glucose / 18.0182 : input.glucose; results["eAG_mmol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eAG_mmol"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["eAG_mgdl"])) + 46.7) / 28.7; results["hba1cPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hba1cPercent"] = Number.NaN; }
  try { const v = 10.93 * (toNumericFormulaValue(results["eAG_mmol"])) - 23.5; results["hba1cMmolMol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hba1cMmolMol"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["hba1cPercent"])) * (1 - input.measurementUncertainty / 100); results["rangeLow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rangeLow"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["hba1cPercent"])) * (1 + input.measurementUncertainty / 100); results["rangeHigh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rangeHigh"] = Number.NaN; }
  return results;
}


export function calculateHba1c_calculator(input: Hba1c_calculatorInput): Hba1c_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hba1cPercent"]);
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


export interface Hba1c_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
