// Auto-generated from geothermal-calculator-schema.json
import * as z from 'zod';

export interface Geothermal_calculatorInput {
  reservoir_temp: number;
  ambient_temp: number;
  flow_rate: number;
  specific_heat: number;
  efficiency: number;
  capacity_factor: number;
  operating_hours: number;
  dataConfidence?: number;
}

export const Geothermal_calculatorInputSchema = z.object({
  reservoir_temp: z.number().default(150),
  ambient_temp: z.number().default(20),
  flow_rate: z.number().default(50),
  specific_heat: z.number().default(4.2),
  efficiency: z.number().default(15),
  capacity_factor: z.number().default(90),
  operating_hours: z.number().default(8000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Geothermal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flow_rate * input.specific_heat * (input.reservoir_temp - input.ambient_temp); results["thermal_power_kW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["thermal_power_kW"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["thermal_power_kW"])) * (input.efficiency / 100); results["electric_power_kW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["electric_power_kW"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["electric_power_kW"])) * input.operating_hours * (input.capacity_factor / 100) / 1000; results["annual_energy_MWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_energy_MWh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annual_energy_MWh"])) * 0.5; results["co2_savings_tons"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["co2_savings_tons"] = Number.NaN; }
  return results;
}


export function calculateGeothermal_calculator(input: Geothermal_calculatorInput): Geothermal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annual_energy_MWh"]);
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


export interface Geothermal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
