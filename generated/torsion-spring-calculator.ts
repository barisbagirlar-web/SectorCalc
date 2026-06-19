// Auto-generated from torsion-spring-calculator-schema.json
import * as z from 'zod';

export interface Torsion_spring_calculatorInput {
  wireDiameter: number;
  meanDiameter: number;
  activeCoils: number;
  deflectionAngle: number;
  shearModulus: number;
  dataConfidence?: number;
}

export const Torsion_spring_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(1),
  meanDiameter: z.number().default(10),
  activeCoils: z.number().default(5),
  deflectionAngle: z.number().default(30),
  shearModulus: z.number().default(79300),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Torsion_spring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.meanDiameter / input.wireDiameter; results["springIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["springIndex"] = 0; }
  try { const v = (input.shearModulus * input.wireDiameter**4) / (3667 * input.meanDiameter * input.activeCoils); results["springRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["springRate"] = 0; }
  try { const v = (asFormulaNumber(results["springRate"])) * input.deflectionAngle; results["torque"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["torque"] = 0; }
  try { const v = (32 * (asFormulaNumber(results["torque"]))) / (Math.PI * input.wireDiameter**3); results["uncorrectedStress"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["uncorrectedStress"] = 0; }
  try { const v = (4 * (asFormulaNumber(results["springIndex"]))**2 - (asFormulaNumber(results["springIndex"])) - 1) / (4 * (asFormulaNumber(results["springIndex"])) * ((asFormulaNumber(results["springIndex"])) - 1)); results["wahlFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wahlFactor"] = 0; }
  try { const v = (asFormulaNumber(results["uncorrectedStress"])) * (asFormulaNumber(results["wahlFactor"])); results["correctedStress"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctedStress"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTorsion_spring_calculator(input: Torsion_spring_calculatorInput): Torsion_spring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["torque"]);
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


export interface Torsion_spring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
