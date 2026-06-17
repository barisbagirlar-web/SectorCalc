// @ts-nocheck
// Auto-generated from pascal-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Pascal_to_psi_calculatorInput {
  pressurePascals: number;
  calibrationFactor: number;
  sensorMaxPa: number;
  sensorAccuracyClass: number;
  outputDecimals: number;
}

export const Pascal_to_psi_calculatorInputSchema = z.object({
  pressurePascals: z.number().default(101325),
  calibrationFactor: z.number().default(1),
  sensorMaxPa: z.number().default(100000),
  sensorAccuracyClass: z.number().default(0.5),
  outputDecimals: z.number().default(4),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pascal_to_psi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.pressurePascals / 6894.76 * input.calibrationFactor; results["rawPsi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawPsi"] = 0; }
  try { const v = (input.sensorMaxPa * input.sensorAccuracyClass / 100) / 6894.76; results["uncertaintyPsi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["uncertaintyPsi"] = 0; }
  try { const v = (asFormulaNumber(results["rawPsi"])) !== 0 ? ((asFormulaNumber(results["uncertaintyPsi"])) / (asFormulaNumber(results["rawPsi"]))) * 100 : 0; results["relativeUncertaintyPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["relativeUncertaintyPercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePascal_to_psi_calculator(input: Pascal_to_psi_calculatorInput): Pascal_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["relativeUncertaintyPercent"]);
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


export interface Pascal_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
