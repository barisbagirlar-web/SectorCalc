// @ts-nocheck
// Auto-generated from refrigerator-energy-calculator-schema.json
import * as z from 'zod';

export interface Refrigerator_energy_calculatorInput {
  compressorPower: number;
  dutyCycle: number;
  daysPerYear: number;
  costPerKwh: number;
}

export const Refrigerator_energy_calculatorInputSchema = z.object({
  compressorPower: z.number().default(150),
  dutyCycle: z.number().default(50),
  daysPerYear: z.number().default(365),
  costPerKwh: z.number().default(0.15),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Refrigerator_energy_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.compressorPower * input.dutyCycle / 100 * 24 * input.daysPerYear) / 1000; results["annualEnergyKwh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualEnergyKwh"] = 0; }
  try { const v = (asFormulaNumber(results["annualEnergyKwh"])) * input.costPerKwh; results["annualCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualCost"] = 0; }
  try { const v = (asFormulaNumber(results["annualCost"])) / 12; results["monthlyCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = (asFormulaNumber(results["annualCost"])) / input.daysPerYear; results["dailyCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRefrigerator_energy_calculator(input: Refrigerator_energy_calculatorInput): Refrigerator_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
