// Auto-generated from horsepower-hours-to-kwh-calculator-schema.json
import * as z from 'zod';

export interface Horsepower_hours_to_kwh_calculatorInput {
  horsepower: number;
  hours: number;
  efficiency: number;
  cost_per_kwh: number;
  dataConfidence?: number;
}

export const Horsepower_hours_to_kwh_calculatorInputSchema = z.object({
  horsepower: z.number().default(100),
  hours: z.number().default(1),
  efficiency: z.number().default(100),
  cost_per_kwh: z.number().default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Horsepower_hours_to_kwh_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.horsepower * input.hours; results["energy_hp_h"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energy_hp_h"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energy_hp_h"])) * 0.745699872 * (input.efficiency / 100); results["energy_kwh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energy_kwh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energy_kwh"])) * input.cost_per_kwh; results["cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cost"] = Number.NaN; }
  return results;
}


export function calculateHorsepower_hours_to_kwh_calculator(input: Horsepower_hours_to_kwh_calculatorInput): Horsepower_hours_to_kwh_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["energy_kwh"]);
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


export interface Horsepower_hours_to_kwh_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
