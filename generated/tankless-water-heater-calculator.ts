// Auto-generated from tankless-water-heater-calculator-schema.json
import * as z from 'zod';

export interface Tankless_water_heater_calculatorInput {
  flowRate: number;
  inletTemp: number;
  outletTemp: number;
  efficiency: number;
  energyCost: number;
  usageTime: number;
  daysPerMonth: number;
  specificHeat: number;
  dataConfidence?: number;
}

export const Tankless_water_heater_calculatorInputSchema = z.object({
  flowRate: z.number().default(6),
  inletTemp: z.number().default(10),
  outletTemp: z.number().default(40),
  efficiency: z.number().default(98),
  energyCost: z.number().default(0.15),
  usageTime: z.number().default(2),
  daysPerMonth: z.number().default(30),
  specificHeat: z.number().default(4.186),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tankless_water_heater_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.flowRate / 60) * input.specificHeat * (input.outletTemp - input.inletTemp) / (input.efficiency / 100); results["requiredPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredPower"] = 0; }
  try { const v = (input.flowRate / 60) * input.specificHeat * (input.outletTemp - input.inletTemp) / (input.efficiency / 100) * input.usageTime; results["dailyEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyEnergy"] = 0; }
  try { const v = (input.flowRate / 60) * input.specificHeat * (input.outletTemp - input.inletTemp) / (input.efficiency / 100) * input.usageTime * input.energyCost; results["dailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (input.flowRate / 60) * input.specificHeat * (input.outletTemp - input.inletTemp) / (input.efficiency / 100) * input.usageTime * input.energyCost * input.daysPerMonth; results["monthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = (input.flowRate / 60) * input.specificHeat * (input.outletTemp - input.inletTemp) / (input.efficiency / 100) * input.usageTime * input.energyCost * 365; results["annualCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTankless_water_heater_calculator(input: Tankless_water_heater_calculatorInput): Tankless_water_heater_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["requiredPower"]));
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


export interface Tankless_water_heater_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
