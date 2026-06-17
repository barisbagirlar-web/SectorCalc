// @ts-nocheck
// Auto-generated from resonance-calculator-schema.json
import * as z from 'zod';

export interface Resonance_calculatorInput {
  mass: number;
  stiffness: number;
  dampingRatio: number;
  excitationFrequency: number;
}

export const Resonance_calculatorInputSchema = z.object({
  mass: z.number().default(1),
  stiffness: z.number().default(100),
  dampingRatio: z.number().default(0.05),
  excitationFrequency: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Resonance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1/(2*input.dampingRatio); results["q"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["q"] = 0; }
  try { const v = 1/(2*input.dampingRatio); results["q_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["q_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateResonance_calculator(input: Resonance_calculatorInput): Resonance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["q_aux"]);
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


export interface Resonance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
