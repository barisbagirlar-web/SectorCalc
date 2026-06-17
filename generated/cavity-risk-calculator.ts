// @ts-nocheck
// Auto-generated from cavity-risk-calculator-schema.json
import * as z from 'zod';

export interface Cavity_risk_calculatorInput {
  meltTemp: number;
  moldTemp: number;
  injectionPressure: number;
  coolingRate: number;
  alloyPurity: number;
  ventingEfficiency: number;
}

export const Cavity_risk_calculatorInputSchema = z.object({
  meltTemp: z.number().default(720),
  moldTemp: z.number().default(180),
  injectionPressure: z.number().default(100),
  coolingRate: z.number().default(50),
  alloyPurity: z.number().default(99.5),
  ventingEfficiency: z.number().default(90),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cavity_risk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 - (input.alloyPurity / 100); results["purityFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["purityFactor"] = 0; }
  try { const v = 1 - (input.ventingEfficiency / 100); results["ventingFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ventingFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCavity_risk_calculator(input: Cavity_risk_calculatorInput): Cavity_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ventingFactor"]);
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


export interface Cavity_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
