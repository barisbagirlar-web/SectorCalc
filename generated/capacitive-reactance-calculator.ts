// @ts-nocheck
// Auto-generated from capacitive-reactance-calculator-schema.json
import * as z from 'zod';

export interface Capacitive_reactance_calculatorInput {
  frequency: number;
  capacitance: number;
  tc: number;
  temperature: number;
  esr: number;
  safety_factor: number;
}

export const Capacitive_reactance_calculatorInputSchema = z.object({
  frequency: z.number().default(1000),
  capacitance: z.number().default(0.000001),
  tc: z.number().default(0),
  temperature: z.number().default(25),
  esr: z.number().default(0.1),
  safety_factor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Capacitive_reactance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.capacitance * (1 + (input.tc * 1e-6) * (input.temperature - 25)); results["C_eff"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["C_eff"] = 0; }
  try { const v = 1 / (2 * Math.PI * input.frequency * (asFormulaNumber(results["C_eff"]))); results["Xc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["Xc"] = 0; }
  try { const v = (asFormulaNumber(results["Xc"])) * input.safety_factor; results["Xc_safe"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["Xc_safe"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCapacitive_reactance_calculator(input: Capacitive_reactance_calculatorInput): Capacitive_reactance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Xc_safe"]);
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


export interface Capacitive_reactance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
