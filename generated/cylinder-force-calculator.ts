// @ts-nocheck
// Auto-generated from cylinder-force-calculator-schema.json
import * as z from 'zod';

export interface Cylinder_force_calculatorInput {
  boreDiameter: number;
  rodDiameter: number;
  pressure: number;
  efficiency: number;
}

export const Cylinder_force_calculatorInputSchema = z.object({
  boreDiameter: z.number().default(50),
  rodDiameter: z.number().default(20),
  pressure: z.number().default(100),
  efficiency: z.number().default(95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cylinder_force_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Math.PI * (input.boreDiameter / 2) ** 2; results["areaBore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["areaBore"] = 0; }
  try { const v = Math.PI * (input.rodDiameter / 2) ** 2; results["areaRod"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["areaRod"] = 0; }
  try { const v = (asFormulaNumber(results["areaBore"])) - (asFormulaNumber(results["areaRod"])); results["areaAnnulus"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["areaAnnulus"] = 0; }
  try { const v = input.pressure * 0.1; results["pressureNmm2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pressureNmm2"] = 0; }
  try { const v = input.efficiency / 100; results["efficiencyFraction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["efficiencyFraction"] = 0; }
  try { const v = (asFormulaNumber(results["pressureNmm2"])) * (asFormulaNumber(results["areaBore"])) * (asFormulaNumber(results["efficiencyFraction"])); results["forceExtension_N"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["forceExtension_N"] = 0; }
  try { const v = (asFormulaNumber(results["pressureNmm2"])) * (asFormulaNumber(results["areaAnnulus"])) * (asFormulaNumber(results["efficiencyFraction"])); results["forceRetraction_N"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["forceRetraction_N"] = 0; }
  try { const v = (asFormulaNumber(results["forceExtension_N"])) / 1000; results["forceExtension_kN"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["forceExtension_kN"] = 0; }
  try { const v = (asFormulaNumber(results["forceRetraction_N"])) / 1000; results["forceRetraction_kN"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["forceRetraction_kN"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCylinder_force_calculator(input: Cylinder_force_calculatorInput): Cylinder_force_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["forceExtension_kN"]);
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


export interface Cylinder_force_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
