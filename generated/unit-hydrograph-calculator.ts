// Auto-generated from unit-hydrograph-calculator-schema.json
import * as z from 'zod';

export interface Unit_hydrograph_calculatorInput {
  drainageArea: number;
  timeConcentration: number;
  peakFactor: number;
  rainfallDuration: number;
  dataConfidence?: number;
}

export const Unit_hydrograph_calculatorInputSchema = z.object({
  drainageArea: z.number().default(10),
  timeConcentration: z.number().default(1.5),
  peakFactor: z.number().default(2.08),
  rainfallDuration: z.number().default(0.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Unit_hydrograph_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.peakFactor * input.drainageArea) / ((input.rainfallDuration / 2) + (0.6 * input.timeConcentration)); results["peakDischarge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["peakDischarge"] = 0; }
  try { const v = (input.rainfallDuration / 2) + (0.6 * input.timeConcentration); results["timeToPeak"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["timeToPeak"] = 0; }
  try { const v = 2.67 * ((input.rainfallDuration / 2) + (0.6 * input.timeConcentration)); results["timeBase"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["timeBase"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateUnit_hydrograph_calculator(input: Unit_hydrograph_calculatorInput): Unit_hydrograph_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["peakDischarge"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Unit_hydrograph_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
