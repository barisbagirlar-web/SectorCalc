// Auto-generated from voltage-divider-calculator-schema.json
import * as z from 'zod';

export interface Voltage_divider_calculatorInput {
  vin: number;
  r1: number;
  r2: number;
  tolerance: number;
  dataConfidence?: number;
}

export const Voltage_divider_calculatorInputSchema = z.object({
  vin: z.number().default(5),
  r1: z.number().default(1000),
  r2: z.number().default(1000),
  tolerance: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Voltage_divider_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vin * input.r2 / (input.r1 + input.r2); results["vout"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vout"] = 0; }
  try { const v = input.vin * (input.r2 * (1 - input.tolerance / 100)) / (input.r1 * (1 + input.tolerance / 100) + input.r2 * (1 - input.tolerance / 100)); results["voutMin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["voutMin"] = 0; }
  try { const v = input.vin * (input.r2 * (1 + input.tolerance / 100)) / (input.r1 * (1 - input.tolerance / 100) + input.r2 * (1 + input.tolerance / 100)); results["voutMax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["voutMax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVoltage_divider_calculator(input: Voltage_divider_calculatorInput): Voltage_divider_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vout"]);
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


export interface Voltage_divider_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
