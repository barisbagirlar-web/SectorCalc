// Auto-generated from hvac-energy-calculator-schema.json
import * as z from 'zod';

export interface Hvac_energy_calculatorInput {
  area: number;
  tempDiff: number;
  heatLossCoefficient: number;
  acCop: number;
  hoursPerDay: number;
  electricityRate: number;
  dataConfidence?: number;
}

export const Hvac_energy_calculatorInputSchema = z.object({
  area: z.number().default(200),
  tempDiff: z.number().default(15),
  heatLossCoefficient: z.number().default(1.5),
  acCop: z.number().default(3.5),
  hoursPerDay: z.number().default(12),
  electricityRate: z.number().default(0.1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hvac_energy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.tempDiff * input.heatLossCoefficient / 1000; results["coolingLoad_kW"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coolingLoad_kW"] = 0; }
  try { const v = (asFormulaNumber(results["coolingLoad_kW"])) / input.acCop * input.hoursPerDay; results["dailyEnergy_kWh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyEnergy_kWh"] = 0; }
  try { const v = (asFormulaNumber(results["dailyEnergy_kWh"])) * input.electricityRate; results["dailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (asFormulaNumber(results["dailyCost"])) * 30; results["monthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = (asFormulaNumber(results["dailyEnergy_kWh"])) * input.electricityRate * 365; results["yearlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yearlyCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHvac_energy_calculator(input: Hvac_energy_calculatorInput): Hvac_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["yearlyCost"]));
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


export interface Hvac_energy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
