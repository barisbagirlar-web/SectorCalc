// Auto-generated from engine-calculator-schema.json
import * as z from 'zod';

export interface Engine_calculatorInput {
  engineSpeed: number;
  torque: number;
  fuelConsumption: number;
  fuelDensity: number;
  heatingValue: number;
  dataConfidence?: number;
}

export const Engine_calculatorInputSchema = z.object({
  engineSpeed: z.number().default(3000),
  torque: z.number().default(200),
  fuelConsumption: z.number().default(15),
  fuelDensity: z.number().default(0.84),
  heatingValue: z.number().default(42.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Engine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.torque * input.engineSpeed) / 9549; results["power_kW"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["power_kW"] = 0; }
  try { const v = (asFormulaNumber(results["power_kW"])) / 0.7457; results["power_HP"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["power_HP"] = 0; }
  try { const v = input.fuelConsumption * input.fuelDensity; results["fuelMassFlow_kgPerH"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelMassFlow_kgPerH"] = 0; }
  try { const v = ((asFormulaNumber(results["fuelMassFlow_kgPerH"])) * input.heatingValue) / 3.6; results["fuelEnergyInput_kW"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelEnergyInput_kW"] = 0; }
  try { const v = (asFormulaNumber(results["power_kW"])) > 0 ? ((asFormulaNumber(results["power_kW"])) / (asFormulaNumber(results["fuelEnergyInput_kW"]))) * 100 : 0; results["brakeThermalEfficiency_percent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["brakeThermalEfficiency_percent"] = 0; }
  try { const v = (asFormulaNumber(results["power_kW"])) > 0 ? ((asFormulaNumber(results["fuelMassFlow_kgPerH"])) * 1000) / (asFormulaNumber(results["power_kW"])) : 0; results["specificFuelConsumption_gPerkWh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["specificFuelConsumption_gPerkWh"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEngine_calculator(input: Engine_calculatorInput): Engine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["power_kW"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
