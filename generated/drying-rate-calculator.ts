// Auto-generated from drying-rate-calculator-schema.json
import * as z from 'zod';

export interface Drying_rate_calculatorInput {
  initial_moisture: number;
  final_moisture: number;
  solid_mass: number;
  drying_rate: number;
  specific_energy: number;
}

export const Drying_rate_calculatorInputSchema = z.object({
  initial_moisture: z.number().default(30),
  final_moisture: z.number().default(10),
  solid_mass: z.number().default(1000),
  drying_rate: z.number().default(50),
  specific_energy: z.number().default(1.2),
});

function evaluateAllFormulas(input: Drying_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.solid_mass * (input.initial_moisture - input.final_moisture) / 100; results["water_removed_kg"] = Number.isFinite(v) ? v : 0; } catch { results["water_removed_kg"] = 0; }
  try { const v = (results["water_removed_kg"] ?? 0) / input.drying_rate; results["drying_time_h"] = Number.isFinite(v) ? v : 0; } catch { results["drying_time_h"] = 0; }
  try { const v = (results["water_removed_kg"] ?? 0) * input.specific_energy; results["energy_consumption_kWh"] = Number.isFinite(v) ? v : 0; } catch { results["energy_consumption_kWh"] = 0; }
  return results;
}


export function calculateDrying_rate_calculator(input: Drying_rate_calculatorInput): Drying_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["water_removed_kg"] ?? 0;
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


export interface Drying_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
