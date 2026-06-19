// Auto-generated from mpg-to-l-per-100km-converter-calculator-schema.json
import * as z from 'zod';

export interface Mpg_to_l_per_100km_converter_calculatorInput {
  mpg_value: number;
  fuel_type: string;
  driving_cycle: string;
  annual_mileage: number;
  fuel_price_per_gallon: number;
  co2_per_gallon: number;
  dataConfidence?: number;
}

export const Mpg_to_l_per_100km_converter_calculatorInputSchema = z.object({
  mpg_value: z.number().min(1).max(100).default(25),
  fuel_type: z.enum(['gasoline', 'diesel', 'ethanol', 'biodiesel']).default('gasoline'),
  driving_cycle: z.enum(['city', 'highway', 'combined']).default('combined'),
  annual_mileage: z.number().min(0).max(200000).default(12000),
  fuel_price_per_gallon: z.number().min(0.5).max(10).default(3.5),
  co2_per_gallon: z.number().min(0).max(15).default(8.887),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mpg_to_l_per_100km_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mpg_value * input.annual_mileage * input.fuel_price_per_gallon * input.co2_per_gallon; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.mpg_value * input.annual_mileage * input.fuel_price_per_gallon * input.co2_per_gallon; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMpg_to_l_per_100km_converter_calculator(input: Mpg_to_l_per_100km_converter_calculatorInput): Mpg_to_l_per_100km_converter_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against fleet averages","Real-time dashboard integration"],
  };
}


export interface Mpg_to_l_per_100km_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
