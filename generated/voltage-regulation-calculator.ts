// Auto-generated from voltage-regulation-calculator-schema.json
import * as z from 'zod';

export interface Voltage_regulation_calculatorInput {
  receivingVoltage: number;
  loadCurrent: number;
  lineResistance: number;
  lineReactance: number;
  powerFactor: number;
}

export const Voltage_regulation_calculatorInputSchema = z.object({
  receivingVoltage: z.number().default(11000),
  loadCurrent: z.number().default(100),
  lineResistance: z.number().default(0.5),
  lineReactance: z.number().default(1),
  powerFactor: z.number().default(0.8),
});

function evaluateAllFormulas(input: Voltage_regulation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(Math.pow(input.receivingVoltage * Math.cos(Math.acos(input.powerFactor)) + input.loadCurrent * input.lineResistance, 2) + Math.pow(input.receivingVoltage * Math.sin(Math.acos(input.powerFactor)) + input.loadCurrent * input.lineReactance, 2)); results["sendingVoltage"] = Number.isFinite(v) ? v : 0; } catch { results["sendingVoltage"] = 0; }
  try { const v = (results["sendingVoltage"] ?? 0) - input.receivingVoltage; results["voltageDrop"] = Number.isFinite(v) ? v : 0; } catch { results["voltageDrop"] = 0; }
  try { const v = (((results["sendingVoltage"] ?? 0) - input.receivingVoltage) / input.receivingVoltage) * 100; results["voltageRegulation"] = Number.isFinite(v) ? v : 0; } catch { results["voltageRegulation"] = 0; }
  return results;
}


export function calculateVoltage_regulation_calculator(input: Voltage_regulation_calculatorInput): Voltage_regulation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["voltageRegulation"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
