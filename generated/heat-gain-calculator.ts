// Auto-generated from heat-gain-calculator-schema.json
import * as z from 'zod';

export interface Heat_gain_calculatorInput {
  wallArea: number;
  wallUvalue: number;
  tempDiff: number;
  windowArea: number;
  windowUvalue: number;
  windowSHGC: number;
  solarRadiation: number;
  dataConfidence?: number;
}

export const Heat_gain_calculatorInputSchema = z.object({
  wallArea: z.number().default(10),
  wallUvalue: z.number().default(0.5),
  tempDiff: z.number().default(15),
  windowArea: z.number().default(4),
  windowUvalue: z.number().default(2),
  windowSHGC: z.number().default(0.7),
  solarRadiation: z.number().default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heat_gain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallArea * input.wallUvalue * input.tempDiff + input.windowArea * input.windowUvalue * input.tempDiff; results["conductionHeatGain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conductionHeatGain"] = 0; }
  try { const v = input.windowArea * input.windowSHGC * input.solarRadiation; results["solarHeatGain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["solarHeatGain"] = 0; }
  try { const v = (asFormulaNumber(results["conductionHeatGain"])) + (asFormulaNumber(results["solarHeatGain"])); results["totalHeatGain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalHeatGain"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHeat_gain_calculator(input: Heat_gain_calculatorInput): Heat_gain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalHeatGain"]);
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


export interface Heat_gain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
