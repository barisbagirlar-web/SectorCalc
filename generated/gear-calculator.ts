// @ts-nocheck
// Auto-generated from gear-calculator-schema.json
import * as z from 'zod';

export interface Gear_calculatorInput {
  module: number;
  z1: number;
  z2: number;
  pressureAngle: number;
  ha: number;
  hf: number;
}

export const Gear_calculatorInputSchema = z.object({
  module: z.number().default(2),
  z1: z.number().default(20),
  z2: z.number().default(40),
  pressureAngle: z.number().default(20),
  ha: z.number().default(1),
  hf: z.number().default(1.25),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gear_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.module * input.z1; results["pitchDiameter1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pitchDiameter1"] = 0; }
  try { const v = input.module * input.z2; results["pitchDiameter2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pitchDiameter2"] = 0; }
  try { const v = input.z2 / input.z1; results["gearRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gearRatio"] = 0; }
  try { const v = (input.module * input.z1 + input.module * input.z2) / 2; results["centerDistance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["centerDistance"] = 0; }
  try { const v = input.ha * input.module; results["addendum"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["addendum"] = 0; }
  try { const v = input.hf * input.module; results["dedendum"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dedendum"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGear_calculator(input: Gear_calculatorInput): Gear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gearRatio"]);
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


export interface Gear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
