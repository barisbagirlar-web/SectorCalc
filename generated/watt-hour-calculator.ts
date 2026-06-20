// Auto-generated from watt-hour-calculator-schema.json
import * as z from 'zod';

export interface Watt_hour_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  time: number;
  efficiency: number;
  dataConfidence?: number;
}

export const Watt_hour_calculatorInputSchema = z.object({
  voltage: z.number().default(230),
  current: z.number().default(10),
  powerFactor: z.number().default(1),
  time: z.number().default(1),
  efficiency: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Watt_hour_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltage * input.current * input.powerFactor * (input.efficiency / 100); results["powerW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerW"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["powerW"])) * input.time; results["energyWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyWh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyWh"])) / 1000; results["energyKwh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyKwh"] = Number.NaN; }
  return results;
}


export function calculateWatt_hour_calculator(input: Watt_hour_calculatorInput): Watt_hour_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["energyWh"]);
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


export interface Watt_hour_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
