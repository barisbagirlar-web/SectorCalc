// Auto-generated from watt-hours-to-btu-calculator-schema.json
import * as z from 'zod';

export interface Watt_hours_to_btu_calculatorInput {
  power: number;
  time: number;
  efficiency: number;
  btuType: number;
  electricityCost: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Watt_hours_to_btu_calculatorInputSchema = z.object({
  power: z.number().default(1000),
  time: z.number().default(1),
  efficiency: z.number().default(100),
  btuType: z.number().default(1),
  electricityCost: z.number().default(0.152),
  decimalPlaces: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Watt_hours_to_btu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.power * input.time * input.efficiency / 100; results["wattHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wattHours"] = 0; }
  try { const v = (asFormulaNumber(results["wattHours"])) * (input.btuType == 1 ? 3.412141633 : input.btuType == 2 ? 3.4142 : 3.608249); results["btu"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["btu"] = 0; }
  try { const v = (asFormulaNumber(results["wattHours"])) / 1000 * input.electricityCost; results["cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWatt_hours_to_btu_calculator(input: Watt_hours_to_btu_calculatorInput): Watt_hours_to_btu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["cost"]));
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


export interface Watt_hours_to_btu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
