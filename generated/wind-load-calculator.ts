// Auto-generated from wind-load-calculator-schema.json
import * as z from 'zod';

export interface Wind_load_calculatorInput {
  basic_wind_speed: number;
  terrain_category: string;
  building_height: number;
  exposure_factor: number;
  gust_factor: number;
  pressure_coefficient: number;
  air_density: number;
  is_cyclic_loading: boolean;
  dataConfidence?: number;
}

export const Wind_load_calculatorInputSchema = z.object({
  basic_wind_speed: z.number().min(10).max(100).default(40),
  terrain_category: z.enum(['A', 'B', 'C', 'D']).default('B'),
  building_height: z.number().min(1).max(500).default(30),
  exposure_factor: z.number().min(0.5).max(2).default(1),
  gust_factor: z.number().min(0.7).max(1.2).default(0.85),
  pressure_coefficient: z.number().min(-1.5).max(1.5).default(0.8),
  air_density: z.number().min(1).max(1.5).default(1.225),
  is_cyclic_loading: z.boolean().default(false),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wind_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.basic_wind_speed * input.building_height * input.exposure_factor * input.gust_factor; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.basic_wind_speed * input.building_height * input.exposure_factor * input.gust_factor * (input.pressure_coefficient * input.air_density); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.pressure_coefficient * input.air_density; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateWind_load_calculator(input: Wind_load_calculatorInput): Wind_load_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Wind_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
