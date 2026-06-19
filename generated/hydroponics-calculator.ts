// Auto-generated from hydroponics-calculator-schema.json
import * as z from 'zod';

export interface Hydroponics_calculatorInput {
  fertilizerMass: number;
  nutrientPercentage: number;
  waterVolumeForStock: number;
  targetPpm: number;
  reservoirWaterVolume: number;
  dataConfidence?: number;
}

export const Hydroponics_calculatorInputSchema = z.object({
  fertilizerMass: z.number().default(100),
  nutrientPercentage: z.number().default(10),
  waterVolumeForStock: z.number().default(1),
  targetPpm: z.number().default(150),
  reservoirWaterVolume: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hydroponics_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fertilizerMass * 10 * input.nutrientPercentage) / input.waterVolumeForStock; results["stockPpm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stockPpm"] = 0; }
  try { const v = (input.targetPpm * input.reservoirWaterVolume) / (asFormulaNumber(results["stockPpm"])); results["stockVolumeL"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stockVolumeL"] = 0; }
  try { const v = (asFormulaNumber(results["stockVolumeL"])) * 1000; results["stockVolumeML"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stockVolumeML"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHydroponics_calculator(input: Hydroponics_calculatorInput): Hydroponics_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["stockVolumeML"]);
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


export interface Hydroponics_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
