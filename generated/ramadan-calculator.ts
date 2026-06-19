// Auto-generated from ramadan-calculator-schema.json
import * as z from 'zod';

export interface Ramadan_calculatorInput {
  normalDailyHours: number;
  ramadanDailyHours: number;
  workingDaysRamadan: number;
  energyConsumptionRate: number;
  energyCostPerKwh: number;
  co2EmissionFactor: number;
  dataConfidence?: number;
}

export const Ramadan_calculatorInputSchema = z.object({
  normalDailyHours: z.number().default(8),
  ramadanDailyHours: z.number().default(6),
  workingDaysRamadan: z.number().default(22),
  energyConsumptionRate: z.number().default(500),
  energyCostPerKwh: z.number().default(2.5),
  co2EmissionFactor: z.number().default(0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ramadan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.normalDailyHours - input.ramadanDailyHours) * input.workingDaysRamadan * input.energyConsumptionRate * input.energyCostPerKwh; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.normalDailyHours * input.workingDaysRamadan * input.energyConsumptionRate; results["Normal Energy Consumption (kWh)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Normal Energy Consumption (kWh)"] = 0; }
  try { const v = input.ramadanDailyHours * input.workingDaysRamadan * input.energyConsumptionRate; results["Ramadan Energy Consumption (kWh)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Ramadan Energy Consumption (kWh)"] = 0; }
  try { const v = (input.normalDailyHours - input.ramadanDailyHours) * input.workingDaysRamadan * input.energyConsumptionRate; results["Total Energy Saved (kWh)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Total Energy Saved (kWh)"] = 0; }
  try { const v = (input.normalDailyHours - input.ramadanDailyHours) * input.workingDaysRamadan * input.energyConsumptionRate * input.co2EmissionFactor; results["CO₂ Emission Reduction (kg)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["CO₂ Emission Reduction (kg)"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRamadan_calculator(input: Ramadan_calculatorInput): Ramadan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CO"]);
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


export interface Ramadan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
