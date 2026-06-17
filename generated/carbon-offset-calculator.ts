// Auto-generated from carbon-offset-calculator-schema.json
import * as z from 'zod';

export interface Carbon_offset_calculatorInput {
  electricityUsage: number;
  naturalGasUsage: number;
  vehicleMiles: number;
  flightMiles: number;
  wasteGeneration: number;
  waterUsage: number;
}

export const Carbon_offset_calculatorInputSchema = z.object({
  electricityUsage: z.number().default(10000),
  naturalGasUsage: z.number().default(1000),
  vehicleMiles: z.number().default(12000),
  flightMiles: z.number().default(5000),
  wasteGeneration: z.number().default(2000),
  waterUsage: z.number().default(50000),
});

function evaluateAllFormulas(input: Carbon_offset_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.000707; results["FACTOR_ELECTRICITY"] = Number.isFinite(v) ? v : 0; } catch { results["FACTOR_ELECTRICITY"] = 0; }
  try { const v = 0.0053; results["FACTOR_NATURAL_GAS"] = Number.isFinite(v) ? v : 0; } catch { results["FACTOR_NATURAL_GAS"] = 0; }
  try { const v = 0.000404; results["FACTOR_VEHICLE"] = Number.isFinite(v) ? v : 0; } catch { results["FACTOR_VEHICLE"] = 0; }
  try { const v = 0.0002; results["FACTOR_FLIGHT"] = Number.isFinite(v) ? v : 0; } catch { results["FACTOR_FLIGHT"] = 0; }
  try { const v = 0.0005; results["FACTOR_WASTE"] = Number.isFinite(v) ? v : 0; } catch { results["FACTOR_WASTE"] = 0; }
  try { const v = 0.000002; results["FACTOR_WATER"] = Number.isFinite(v) ? v : 0; } catch { results["FACTOR_WATER"] = 0; }
  try { const v = input.electricityUsage; results["emissions"] = Number.isFinite(v) ? v : 0; } catch { results["emissions"] = 0; }
  try { const v = electricity + naturalGas + vehicle + flights + waste + water; results["totalEmissions"] = Number.isFinite(v) ? v : 0; } catch { results["totalEmissions"] = 0; }
  try { const v = Math.round((results["totalEmissions"] ?? 0) * 100) / 100; results["round2"] = Number.isFinite(v) ? v : 0; } catch { results["round2"] = 0; }
  results["_electricity_toFixed_2___metric_tons"] = 0;
  results["_naturalGas_toFixed_2___metric_tons"] = 0;
  results["_vehicle_toFixed_2___metric_tons"] = 0;
  results["_flights_toFixed_2___metric_tons"] = 0;
  results["_waste_toFixed_2___metric_tons"] = 0;
  results["_water_toFixed_2___metric_tons"] = 0;
  return results;
}


export function calculateCarbon_offset_calculator(input: Carbon_offset_calculatorInput): Carbon_offset_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["FACTOR_ELECTRICITY"] ?? 0;
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


export interface Carbon_offset_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
