// @ts-nocheck
// Auto-generated from glasses-prescription-calculator-schema.json
import * as z from 'zod';

export interface Glasses_prescription_calculatorInput {
  sphere: number;
  cylinder: number;
  axis: number;
  vertexDistance: number;
}

export const Glasses_prescription_calculatorInputSchema = z.object({
  sphere: z.number().default(0),
  cylinder: z.number().default(0),
  axis: z.number().default(0),
  vertexDistance: z.number().default(12),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Glasses_prescription_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.vertexDistance / 1000; results["d"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["d"] = 0; }
  try { const v = input.sphere; results["S1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["S1"] = 0; }
  try { const v = input.sphere + input.cylinder; results["S2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["S2"] = 0; }
  try { const v = (asFormulaNumber(results["S1"])) / (1 - (asFormulaNumber(results["d"])) * (asFormulaNumber(results["S1"]))); results["S1_eff"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["S1_eff"] = 0; }
  try { const v = (asFormulaNumber(results["S2"])) / (1 - (asFormulaNumber(results["d"])) * (asFormulaNumber(results["S2"]))); results["S2_eff"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["S2_eff"] = 0; }
  try { const v = (asFormulaNumber(results["S1_eff"])); results["newSphere"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["newSphere"] = 0; }
  try { const v = (asFormulaNumber(results["S2_eff"])) - (asFormulaNumber(results["S1_eff"])); results["newCylinder"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["newCylinder"] = 0; }
  try { const v = input.axis; results["newAxis"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["newAxis"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGlasses_prescription_calculator(input: Glasses_prescription_calculatorInput): Glasses_prescription_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["newAxis"]);
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


export interface Glasses_prescription_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
