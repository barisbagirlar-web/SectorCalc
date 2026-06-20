// Auto-generated from soil-volume-calculator-schema.json
import * as z from 'zod';

export interface Soil_volume_calculatorInput {
  length: number;
  width: number;
  depth: number;
  density: number;
  compactionFactor: number;
  dataConfidence?: number;
}

export const Soil_volume_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  depth: z.number().default(0.5),
  density: z.number().default(1.6),
  compactionFactor: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Soil_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.depth * input.compactionFactor; results["soilVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["soilVolume"] = Number.NaN; }
  try { const v = input.length * input.width * input.depth * input.compactionFactor * 1.30795; results["soilVolumeYards"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["soilVolumeYards"] = Number.NaN; }
  try { const v = input.length * input.width * input.depth * input.compactionFactor * input.density; results["soilWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["soilWeight"] = Number.NaN; }
  return results;
}


export function calculateSoil_volume_calculator(input: Soil_volume_calculatorInput): Soil_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["soilVolume"]);
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


export interface Soil_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
