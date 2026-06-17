// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Voltage_regulation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.receivingVoltage + input.loadCurrent + input.lineResistance; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.receivingVoltage + input.loadCurrent + input.lineResistance; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVoltage_regulation_calculator(input: Voltage_regulation_calculatorInput): Voltage_regulation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Voltage_regulation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
