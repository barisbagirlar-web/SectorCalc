// Auto-generated from pascal-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Pascal_to_psi_calculatorInput {
  pressurePascals: number;
  calibrationFactor: number;
  sensorMaxPa: number;
  sensorAccuracyClass: number;
  outputDecimals: number;
  dataConfidence?: number;
}

export const Pascal_to_psi_calculatorInputSchema = z.object({
  pressurePascals: z.number().default(101325),
  calibrationFactor: z.number().default(1),
  sensorMaxPa: z.number().default(100000),
  sensorAccuracyClass: z.number().default(0.5),
  outputDecimals: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pascal_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressurePascals / 6894.76 * input.calibrationFactor; results["rawPsi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawPsi"] = Number.NaN; }
  try { const v = (input.sensorMaxPa * input.sensorAccuracyClass / 100) / 6894.76; results["uncertaintyPsi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["uncertaintyPsi"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawPsi"])) !== 0 ? ((toNumericFormulaValue(results["uncertaintyPsi"])) / (toNumericFormulaValue(results["rawPsi"]))) * 100 : 0; results["relativeUncertaintyPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["relativeUncertaintyPercent"] = Number.NaN; }
  return results;
}


export function calculatePascal_to_psi_calculator(input: Pascal_to_psi_calculatorInput): Pascal_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["relativeUncertaintyPercent"]);
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


export interface Pascal_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
