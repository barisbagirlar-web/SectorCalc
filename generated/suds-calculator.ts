// @ts-nocheck
// Auto-generated from suds-calculator-schema.json
import * as z from 'zod';

export interface Suds_calculatorInput {
  catchmentArea: number;
  rainfallIntensity: number;
  runoffCoefficient: number;
  stormDuration: number;
  safetyFactor: number;
}

export const Suds_calculatorInputSchema = z.object({
  catchmentArea: z.number().default(1000),
  rainfallIntensity: z.number().default(50),
  runoffCoefficient: z.number().default(0.9),
  stormDuration: z.number().default(60),
  safetyFactor: z.number().default(1.2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Suds_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.stormDuration / 60; results["durationHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["durationHours"] = 0; }
  try { const v = (input.rainfallIntensity * (asFormulaNumber(results["durationHours"]))) / 1000; results["rainfallDepthM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rainfallDepthM"] = 0; }
  try { const v = input.catchmentArea * (asFormulaNumber(results["rainfallDepthM"])) * input.runoffCoefficient; results["runoffVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["runoffVolume"] = 0; }
  try { const v = (asFormulaNumber(results["runoffVolume"])) * input.safetyFactor; results["requiredStorage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["requiredStorage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSuds_calculator(input: Suds_calculatorInput): Suds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredStorage"]);
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


export interface Suds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
