// @ts-nocheck
// Auto-generated from polarization-calculator-schema.json
import * as z from 'zod';

export interface Polarization_calculatorInput {
  incident_intensity: number;
  incident_angle: number;
  polarizer1_angle: number;
  polarizer2_angle: number;
}

export const Polarization_calculatorInputSchema = z.object({
  incident_intensity: z.number().default(1),
  incident_angle: z.number().default(0),
  polarizer1_angle: z.number().default(0),
  polarizer2_angle: z.number().default(45),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Polarization_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.incident_intensity + input.incident_angle + input.polarizer1_angle; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.incident_intensity + input.incident_angle + input.polarizer1_angle; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePolarization_calculator(input: Polarization_calculatorInput): Polarization_calculatorOutput {
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


export interface Polarization_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
