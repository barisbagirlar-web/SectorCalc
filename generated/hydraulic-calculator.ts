// @ts-nocheck
// Auto-generated from hydraulic-calculator-schema.json
import * as z from 'zod';

export interface Hydraulic_calculatorInput {
  pressure: number;
  flowRate: number;
  efficiency: number;
  boreDia: number;
  rodDia: number;
}

export const Hydraulic_calculatorInputSchema = z.object({
  pressure: z.number().default(100),
  flowRate: z.number().default(50),
  efficiency: z.number().default(85),
  boreDia: z.number().default(80),
  rodDia: z.number().default(40),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hydraulic_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.pressure * input.flowRate) / (600 * (input.efficiency / 100)); results["power"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["power"] = 0; }
  try { const v = (input.pressure * Math.PI * input.boreDia**2) / 40000; results["pushForce"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pushForce"] = 0; }
  try { const v = (input.pressure * Math.PI * (input.boreDia**2 - input.rodDia**2)) / 40000; results["pullForce"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pullForce"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHydraulic_calculator(input: Hydraulic_calculatorInput): Hydraulic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["power"]);
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


export interface Hydraulic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
