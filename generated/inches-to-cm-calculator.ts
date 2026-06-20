// Auto-generated from inches-to-cm-calculator-schema.json
import * as z from 'zod';

export interface Inches_to_cm_calculatorInput {
  inches: number;
  calibrationOffset: number;
  uncertaintyPercent: number;
  conversionFactor: number;
  toleranceMm: number;
  measurementTemperature: number;
  materialExpansionCoeff: number;
  referenceTemperature: number;
  dataConfidence?: number;
}

export const Inches_to_cm_calculatorInputSchema = z.object({
  inches: z.number().default(1),
  calibrationOffset: z.number().default(0),
  uncertaintyPercent: z.number().default(0),
  conversionFactor: z.number().default(2.54),
  toleranceMm: z.number().default(0.5),
  measurementTemperature: z.number().default(20),
  materialExpansionCoeff: z.number().default(0.0000115),
  referenceTemperature: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Inches_to_cm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.inches + input.calibrationOffset) * input.conversionFactor; results["rawCm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawCm"] = Number.NaN; }
  try { const v = 1 + input.materialExpansionCoeff * (input.measurementTemperature - input.referenceTemperature); results["thermalCorrection"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["thermalCorrection"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawCm"])) * (toNumericFormulaValue(results["thermalCorrection"])); results["convertedLengthCm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["convertedLengthCm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["convertedLengthCm"])) * (input.uncertaintyPercent / 100); results["expandedUncertaintyCm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expandedUncertaintyCm"] = Number.NaN; }
  return results;
}


export function calculateInches_to_cm_calculator(input: Inches_to_cm_calculatorInput): Inches_to_cm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["convertedLengthCm"]);
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


export interface Inches_to_cm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
