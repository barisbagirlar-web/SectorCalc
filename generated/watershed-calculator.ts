// Auto-generated from watershed-calculator-schema.json
import * as z from 'zod';

export interface Watershed_calculatorInput {
  drainageArea: number;
  runoffCoefficient: number;
  rainfallIntensity: number;
  channelLength: number;
  slope: number;
  dataConfidence?: number;
}

export const Watershed_calculatorInputSchema = z.object({
  drainageArea: z.number().default(10),
  runoffCoefficient: z.number().default(0.5),
  rainfallIntensity: z.number().default(25),
  channelLength: z.number().default(500),
  slope: z.number().default(0.01),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Watershed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.runoffCoefficient * input.rainfallIntensity * input.drainageArea) / 360; results["peakDischarge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["peakDischarge"] = 0; }
  try { const v = input.rainfallIntensity * input.drainageArea * 10; results["runoffVolumePerHour"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["runoffVolumePerHour"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWatershed_calculator(input: Watershed_calculatorInput): Watershed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["peakDischarge"]);
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


export interface Watershed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
