// Auto-generated from cylinder-force-calculator-schema.json
import * as z from 'zod';

export interface Cylinder_force_calculatorInput {
  boreDiameter: number;
  rodDiameter: number;
  pressure: number;
  efficiency: number;
  dataConfidence?: number;
}

export const Cylinder_force_calculatorInputSchema = z.object({
  boreDiameter: z.number().default(50),
  rodDiameter: z.number().default(20),
  pressure: z.number().default(100),
  efficiency: z.number().default(95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cylinder_force_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.boreDiameter / 2) ** 2; results["areaBore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaBore"] = Number.NaN; }
  try { const v = Math.PI * (input.rodDiameter / 2) ** 2; results["areaRod"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaRod"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["areaBore"])) - (toNumericFormulaValue(results["areaRod"])); results["areaAnnulus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaAnnulus"] = Number.NaN; }
  try { const v = input.pressure * 0.1; results["pressureNmm2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressureNmm2"] = Number.NaN; }
  try { const v = input.efficiency / 100; results["efficiencyFraction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["efficiencyFraction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pressureNmm2"])) * (toNumericFormulaValue(results["areaBore"])) * (toNumericFormulaValue(results["efficiencyFraction"])); results["forceExtension_N"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["forceExtension_N"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pressureNmm2"])) * (toNumericFormulaValue(results["areaAnnulus"])) * (toNumericFormulaValue(results["efficiencyFraction"])); results["forceRetraction_N"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["forceRetraction_N"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["forceExtension_N"])) / 1000; results["forceExtension_kN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["forceExtension_kN"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["forceRetraction_N"])) / 1000; results["forceRetraction_kN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["forceRetraction_kN"] = Number.NaN; }
  return results;
}


export function calculateCylinder_force_calculator(input: Cylinder_force_calculatorInput): Cylinder_force_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["forceExtension_kN"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
