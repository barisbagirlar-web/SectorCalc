// Auto-generated from phantom-load-calculator-schema.json
import * as z from 'zod';

export interface Phantom_load_calculatorInput {
  standbyWatt: number;
  numberOfDevices: number;
  standbyHoursPerDay: number;
  electricityCost: number;
  carbonFactor: number;
  operatingDaysPerYear: number;
  dataConfidence?: number;
}

export const Phantom_load_calculatorInputSchema = z.object({
  standbyWatt: z.number().default(5),
  numberOfDevices: z.number().default(1),
  standbyHoursPerDay: z.number().default(24),
  electricityCost: z.number().default(1.5),
  carbonFactor: z.number().default(0.5),
  operatingDaysPerYear: z.number().default(365),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Phantom_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.standbyWatt * input.numberOfDevices * input.standbyHoursPerDay) / 1000; results["dailyEnergyKwh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyEnergyKwh"] = 0; }
  try { const v = (asFormulaNumber(results["dailyEnergyKwh"])) * input.operatingDaysPerYear; results["annualEnergyKwh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualEnergyKwh"] = 0; }
  try { const v = (asFormulaNumber(results["annualEnergyKwh"])) * input.electricityCost; results["annualCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualCost"] = 0; }
  try { const v = (asFormulaNumber(results["annualEnergyKwh"])) * input.carbonFactor; results["annualCarbonKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualCarbonKg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePhantom_load_calculator(input: Phantom_load_calculatorInput): Phantom_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["annualCost"]));
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


export interface Phantom_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
