// Auto-generated from engine-calculator-schema.json
import * as z from 'zod';

export interface Engine_calculatorInput {
  engineSpeed: number;
  torque: number;
  fuelConsumption: number;
  fuelDensity: number;
  heatingValue: number;
}

export const Engine_calculatorInputSchema = z.object({
  engineSpeed: z.number().default(3000),
  torque: z.number().default(200),
  fuelConsumption: z.number().default(15),
  fuelDensity: z.number().default(0.84),
  heatingValue: z.number().default(42.5),
});

function evaluateAllFormulas(input: Engine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.torque * input.engineSpeed) / 9549; results["power_kW"] = Number.isFinite(v) ? v : 0; } catch { results["power_kW"] = 0; }
  try { const v = (results["power_kW"] ?? 0) / 0.7457; results["power_HP"] = Number.isFinite(v) ? v : 0; } catch { results["power_HP"] = 0; }
  try { const v = input.fuelConsumption * input.fuelDensity; results["fuelMassFlow_kgPerH"] = Number.isFinite(v) ? v : 0; } catch { results["fuelMassFlow_kgPerH"] = 0; }
  try { const v = ((results["fuelMassFlow_kgPerH"] ?? 0) * input.heatingValue) / 3.6; results["fuelEnergyInput_kW"] = Number.isFinite(v) ? v : 0; } catch { results["fuelEnergyInput_kW"] = 0; }
  try { const v = (results["power_kW"] ?? 0) > 0 ? ((results["power_kW"] ?? 0) / (results["fuelEnergyInput_kW"] ?? 0)) * 100 : 0; results["brakeThermalEfficiency_percent"] = Number.isFinite(v) ? v : 0; } catch { results["brakeThermalEfficiency_percent"] = 0; }
  try { const v = (results["power_kW"] ?? 0) > 0 ? ((results["fuelMassFlow_kgPerH"] ?? 0) * 1000) / (results["power_kW"] ?? 0) : 0; results["specificFuelConsumption_gPerkWh"] = Number.isFinite(v) ? v : 0; } catch { results["specificFuelConsumption_gPerkWh"] = 0; }
  return results;
}


export function calculateEngine_calculator(input: Engine_calculatorInput): Engine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["power_kW"] ?? 0;
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


export interface Engine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
