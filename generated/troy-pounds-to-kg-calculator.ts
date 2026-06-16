// Auto-generated from troy-pounds-to-kg-calculator-schema.json
import * as z from 'zod';

export interface Troy_pounds_to_kg_calculatorInput {
  troyPounds: number;
  precision: number;
  batchSize: number;
  scaleCalibrationFactor: number;
  measurementUncertainty: number;
}

export const Troy_pounds_to_kg_calculatorInputSchema = z.object({
  troyPounds: z.number().default(1),
  precision: z.number().default(4),
  batchSize: z.number().default(1),
  scaleCalibrationFactor: z.number().default(1),
  measurementUncertainty: z.number().default(0.1),
});

function evaluateAllFormulas(input: Troy_pounds_to_kg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.3732417216; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.troyPounds * 0.3732417216 * input.scaleCalibrationFactor * input.batchSize; results["rawKg"] = Number.isFinite(v) ? v : 0; } catch { results["rawKg"] = 0; }
  try { const v = (results["rawKg"] ?? 0) * (1 - input.measurementUncertainty / 100); results["lower"] = Number.isFinite(v) ? v : 0; } catch { results["lower"] = 0; }
  try { const v = (results["rawKg"] ?? 0) * (1 + input.measurementUncertainty / 100); results["upper"] = Number.isFinite(v) ? v : 0; } catch { results["upper"] = 0; }
  try { const v = Math.round(((results["rawKg"] ?? 0) + Number.EPSILON) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["kgRounded"] = Number.isFinite(v) ? v : 0; } catch { results["kgRounded"] = 0; }
  try { const v = Math.round(((results["lower"] ?? 0) + Number.EPSILON) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["lowerRounded"] = Number.isFinite(v) ? v : 0; } catch { results["lowerRounded"] = 0; }
  try { const v = Math.round(((results["upper"] ?? 0) + Number.EPSILON) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["upperRounded"] = Number.isFinite(v) ? v : 0; } catch { results["upperRounded"] = 0; }
  try { const v = 'Conversion factor: 1 troy lb = 0.3732417216 kg'; results["conversionInfo"] = Number.isFinite(v) ? v : 0; } catch { results["conversionInfo"] = 0; }
  return results;
}


export function calculateTroy_pounds_to_kg_calculator(input: Troy_pounds_to_kg_calculatorInput): Troy_pounds_to_kg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["kgRounded"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Troy_pounds_to_kg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
