// Auto-generated from welding-heat-input-calculator-schema.json
import * as z from 'zod';

export interface Welding_heat_input_calculatorInput {
  voltage: number;
  current: number;
  travelSpeed: number;
  efficiency: number;
  dataConfidence?: number;
}

export const Welding_heat_input_calculatorInputSchema = z.object({
  voltage: z.number().default(25),
  current: z.number().default(200),
  travelSpeed: z.number().default(300),
  efficiency: z.number().default(0.8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Welding_heat_input_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.voltage * input.current * 60 * input.efficiency) / (input.travelSpeed * 1000); results["heatInput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heatInput"] = Number.NaN; }
  try { const v = (input.voltage * input.current * input.efficiency * 60) / 1000; results["effectiveHeatRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveHeatRate"] = Number.NaN; }
  try { const v = input.voltage * input.current; results["powerInput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerInput"] = Number.NaN; }
  return results;
}


export function calculateWelding_heat_input_calculator(input: Welding_heat_input_calculatorInput): Welding_heat_input_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["heatInput"]);
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


export interface Welding_heat_input_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
