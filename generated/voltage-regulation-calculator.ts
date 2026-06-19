// Auto-generated from voltage-regulation-calculator-schema.json
import * as z from 'zod';

export interface Voltage_regulation_calculatorInput {
  receivingVoltage: number;
  loadCurrent: number;
  lineResistance: number;
  lineReactance: number;
  powerFactor: number;
  dataConfidence?: number;
}

export const Voltage_regulation_calculatorInputSchema = z.object({
  receivingVoltage: z.number().default(11000),
  loadCurrent: z.number().default(100),
  lineResistance: z.number().default(0.5),
  lineReactance: z.number().default(1),
  powerFactor: z.number().default(0.8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Voltage_regulation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.receivingVoltage * input.loadCurrent * input.lineResistance * input.lineReactance; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.receivingVoltage * input.loadCurrent * input.lineResistance * input.lineReactance * (input.powerFactor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.powerFactor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVoltage_regulation_calculator(input: Voltage_regulation_calculatorInput): Voltage_regulation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Voltage_regulation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
