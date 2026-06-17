// @ts-nocheck
// Auto-generated from electrical-panel-calculator-schema.json
import * as z from 'zod';

export interface Electrical_panel_calculatorInput {
  voltage: number;
  phases: number;
  numberOfCircuits: number;
  loadPerCircuit: number;
  diversityFactor: number;
  powerFactor: number;
}

export const Electrical_panel_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  phases: z.number().default(3),
  numberOfCircuits: z.number().default(10),
  loadPerCircuit: z.number().default(20),
  diversityFactor: z.number().default(0.8),
  powerFactor: z.number().default(0.85),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Electrical_panel_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.numberOfCircuits * input.loadPerCircuit * input.diversityFactor; results["totalCurrent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCurrent"] = 0; }
  try { const v = input.numberOfCircuits * input.loadPerCircuit * input.diversityFactor; results["totalCurrent_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCurrent_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateElectrical_panel_calculator(input: Electrical_panel_calculatorInput): Electrical_panel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCurrent"]);
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


export interface Electrical_panel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
