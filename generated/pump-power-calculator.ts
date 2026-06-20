// Auto-generated from pump-power-calculator-schema.json
import * as z from 'zod';

export interface Pump_power_calculatorInput {
  flowRate: number;
  head: number;
  density: number;
  pumpEfficiency: number;
  motorEfficiency: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Pump_power_calculatorInputSchema = z.object({
  flowRate: z.number().default(0.01),
  head: z.number().default(10),
  density: z.number().default(1000),
  pumpEfficiency: z.number().default(0.7),
  motorEfficiency: z.number().default(0.95),
  safetyFactor: z.number().default(1.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pump_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.density * 9.81 * input.flowRate * input.head; results["hydraulicPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hydraulicPower"] = Number.NaN; }
  try { const v = input.density * 9.81 * input.flowRate * input.head / input.pumpEfficiency; results["shaftPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shaftPower"] = Number.NaN; }
  try { const v = (input.density * 9.81 * input.flowRate * input.head) / (input.pumpEfficiency * input.motorEfficiency); results["motorInputPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["motorInputPower"] = Number.NaN; }
  try { const v = (input.density * 9.81 * input.flowRate * input.head * input.safetyFactor) / (input.pumpEfficiency * input.motorEfficiency); results["totalRequiredPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRequiredPower"] = Number.NaN; }
  return results;
}


export function calculatePump_power_calculator(input: Pump_power_calculatorInput): Pump_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRequiredPower"]);
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


export interface Pump_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
