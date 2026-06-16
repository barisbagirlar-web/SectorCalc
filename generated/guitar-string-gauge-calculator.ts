// Auto-generated from guitar-string-gauge-calculator-schema.json
import * as z from 'zod';

export interface Guitar_string_gauge_calculatorInput {
  scaleLength: number;
  frequency: number;
  stringDiameter: number;
  density: number;
}

export const Guitar_string_gauge_calculatorInputSchema = z.object({
  scaleLength: z.number().default(648),
  frequency: z.number().default(82.41),
  stringDiameter: z.number().default(1.17),
  density: z.number().default(7850),
});

function evaluateAllFormulas(input: Guitar_string_gauge_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.density * Math.PI * (input.stringDiameter/2000) ** 2; results["massPerUnitLength"] = Number.isFinite(v) ? v : 0; } catch { results["massPerUnitLength"] = 0; }
  try { const v = (results["massPerUnitLength"] ?? 0) * (2 * (input.scaleLength/1000) * input.frequency) ** 2; results["tension"] = Number.isFinite(v) ? v : 0; } catch { results["tension"] = 0; }
  try { const v = 2 * (input.scaleLength/1000) * input.frequency; results["waveSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["waveSpeed"] = 0; }
  return results;
}


export function calculateGuitar_string_gauge_calculator(input: Guitar_string_gauge_calculatorInput): Guitar_string_gauge_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tension"] ?? 0;
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


export interface Guitar_string_gauge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
