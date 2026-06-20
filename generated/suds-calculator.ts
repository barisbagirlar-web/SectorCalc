// Auto-generated from suds-calculator-schema.json
import * as z from 'zod';

export interface Suds_calculatorInput {
  catchmentArea: number;
  rainfallIntensity: number;
  runoffCoefficient: number;
  stormDuration: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Suds_calculatorInputSchema = z.object({
  catchmentArea: z.number().default(1000),
  rainfallIntensity: z.number().default(50),
  runoffCoefficient: z.number().default(0.9),
  stormDuration: z.number().default(60),
  safetyFactor: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Suds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stormDuration / 60; results["durationHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["durationHours"] = Number.NaN; }
  try { const v = (input.rainfallIntensity * (toNumericFormulaValue(results["durationHours"]))) / 1000; results["rainfallDepthM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rainfallDepthM"] = Number.NaN; }
  try { const v = input.catchmentArea * (toNumericFormulaValue(results["rainfallDepthM"])) * input.runoffCoefficient; results["runoffVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["runoffVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["runoffVolume"])) * input.safetyFactor; results["requiredStorage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredStorage"] = Number.NaN; }
  return results;
}


export function calculateSuds_calculator(input: Suds_calculatorInput): Suds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredStorage"]);
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


export interface Suds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
