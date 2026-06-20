// Auto-generated from drying-rate-calculator-schema.json
import * as z from 'zod';

export interface Drying_rate_calculatorInput {
  initial_moisture: number;
  final_moisture: number;
  solid_mass: number;
  drying_rate: number;
  specific_energy: number;
  dataConfidence?: number;
}

export const Drying_rate_calculatorInputSchema = z.object({
  initial_moisture: z.number().default(30),
  final_moisture: z.number().default(10),
  solid_mass: z.number().default(1000),
  drying_rate: z.number().default(50),
  specific_energy: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Drying_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.solid_mass * (input.initial_moisture - input.final_moisture) / 100; results["water_removed_kg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["water_removed_kg"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["water_removed_kg"])) / input.drying_rate; results["drying_time_h"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["drying_time_h"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["water_removed_kg"])) * input.specific_energy; results["energy_consumption_kWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energy_consumption_kWh"] = Number.NaN; }
  return results;
}


export function calculateDrying_rate_calculator(input: Drying_rate_calculatorInput): Drying_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["water_removed_kg"]);
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


export interface Drying_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
