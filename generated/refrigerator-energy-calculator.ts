// Auto-generated from refrigerator-energy-calculator-schema.json
import * as z from 'zod';

export interface Refrigerator_energy_calculatorInput {
  compressorPower: number;
  dutyCycle: number;
  daysPerYear: number;
  costPerKwh: number;
  dataConfidence?: number;
}

export const Refrigerator_energy_calculatorInputSchema = z.object({
  compressorPower: z.number().default(150),
  dutyCycle: z.number().default(50),
  daysPerYear: z.number().default(365),
  costPerKwh: z.number().default(0.15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Refrigerator_energy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.compressorPower * input.dutyCycle / 100 * 24 * input.daysPerYear) / 1000; results["annualEnergyKwh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualEnergyKwh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualEnergyKwh"])) * input.costPerKwh; results["annualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualCost"])) / 12; results["monthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualCost"])) / input.daysPerYear; results["dailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCost"] = Number.NaN; }
  return results;
}


export function calculateRefrigerator_energy_calculator(input: Refrigerator_energy_calculatorInput): Refrigerator_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyCost"]);
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


export interface Refrigerator_energy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
