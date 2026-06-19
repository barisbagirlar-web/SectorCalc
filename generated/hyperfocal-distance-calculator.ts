// Auto-generated from hyperfocal-distance-calculator-schema.json
import * as z from 'zod';

export interface Hyperfocal_distance_calculatorInput {
  focalLength: number;
  aperture: number;
  circleOfConfusion: number;
  outputUnitMultiplier: number;
  dataConfidence?: number;
}

export const Hyperfocal_distance_calculatorInputSchema = z.object({
  focalLength: z.number().default(50),
  aperture: z.number().default(8),
  circleOfConfusion: z.number().default(0.03),
  outputUnitMultiplier: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hyperfocal_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.focalLength**2 / (input.aperture * input.circleOfConfusion) + input.focalLength; results["H_mm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["H_mm"] = 0; }
  try { const v = (asFormulaNumber(results["H_mm"])) * input.outputUnitMultiplier; results["hyperfocal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hyperfocal"] = 0; }
  try { const v = (asFormulaNumber(results["H_mm"])) * input.outputUnitMultiplier / 2; results["nearLimit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nearLimit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHyperfocal_distance_calculator(input: Hyperfocal_distance_calculatorInput): Hyperfocal_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hyperfocal"]);
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


export interface Hyperfocal_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
