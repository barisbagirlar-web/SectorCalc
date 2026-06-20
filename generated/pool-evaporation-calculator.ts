// Auto-generated from pool-evaporation-calculator-schema.json
import * as z from 'zod';

export interface Pool_evaporation_calculatorInput {
  surfaceArea: number;
  waterTemp: number;
  airTemp: number;
  relativeHumidity: number;
  windSpeed: number;
  dataConfidence?: number;
}

export const Pool_evaporation_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(50),
  waterTemp: z.number().default(28),
  airTemp: z.number().default(25),
  relativeHumidity: z.number().default(60),
  windSpeed: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pool_evaporation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.surfaceArea * input.waterTemp * input.airTemp * (input.relativeHumidity / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.surfaceArea * input.waterTemp * input.airTemp * (input.relativeHumidity / 100) * (input.windSpeed); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.windSpeed; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculatePool_evaporation_calculator(input: Pool_evaporation_calculatorInput): Pool_evaporation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Pool_evaporation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
