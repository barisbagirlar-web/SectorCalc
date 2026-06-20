// Auto-generated from guitar-string-gauge-calculator-schema.json
import * as z from 'zod';

export interface Guitar_string_gauge_calculatorInput {
  scaleLength: number;
  frequency: number;
  stringDiameter: number;
  density: number;
  dataConfidence?: number;
}

export const Guitar_string_gauge_calculatorInputSchema = z.object({
  scaleLength: z.number().default(648),
  frequency: z.number().default(82.41),
  stringDiameter: z.number().default(1.17),
  density: z.number().default(7850),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Guitar_string_gauge_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.density * Math.PI * (input.stringDiameter/2000) ** 2; results["massPerUnitLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["massPerUnitLength"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["massPerUnitLength"])) * (2 * (input.scaleLength/1000) * input.frequency) ** 2; results["tension"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tension"] = Number.NaN; }
  try { const v = 2 * (input.scaleLength/1000) * input.frequency; results["waveSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waveSpeed"] = Number.NaN; }
  return results;
}


export function calculateGuitar_string_gauge_calculator(input: Guitar_string_gauge_calculatorInput): Guitar_string_gauge_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tension"]);
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


export interface Guitar_string_gauge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
