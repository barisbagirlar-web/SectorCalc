// Auto-generated from pressure-vessel-calculator-schema.json
import * as z from 'zod';

export interface Pressure_vessel_calculatorInput {
  pressure: number;
  diameter: number;
  allowableStress: number;
  jointEfficiency: number;
  corrosionAllowance: number;
  dataConfidence?: number;
}

export const Pressure_vessel_calculatorInputSchema = z.object({
  pressure: z.number().default(1.5),
  diameter: z.number().default(1000),
  allowableStress: z.number().default(138),
  jointEfficiency: z.number().default(0.85),
  corrosionAllowance: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pressure_vessel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.pressure * (input.diameter / 2)) / (input.allowableStress * input.jointEfficiency - 0.6 * input.pressure)) + input.corrosionAllowance; results["requiredThickness"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredThickness"] = 0; }
  try { const v = ((input.pressure * (input.diameter / 2)) / (input.allowableStress * input.jointEfficiency - 0.6 * input.pressure)) + input.corrosionAllowance; results["hoopThickness"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hoopThickness"] = 0; }
  try { const v = ((input.pressure * (input.diameter / 2)) / (2 * input.allowableStress * input.jointEfficiency + 0.4 * input.pressure)) + input.corrosionAllowance; results["longitudinalThickness"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["longitudinalThickness"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePressure_vessel_calculator(input: Pressure_vessel_calculatorInput): Pressure_vessel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredThickness"]);
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


export interface Pressure_vessel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
