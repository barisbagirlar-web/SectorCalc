// Auto-generated from turbine-calculator-schema.json
import * as z from 'zod';

export interface Turbine_calculatorInput {
  airDensity: number;
  rotorDiameter: number;
  windSpeed: number;
  efficiency: number;
  dataConfidence?: number;
}

export const Turbine_calculatorInputSchema = z.object({
  airDensity: z.number().default(1.225),
  rotorDiameter: z.number().default(80),
  windSpeed: z.number().default(12),
  efficiency: z.number().default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Turbine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.rotorDiameter / 2) ** 2; results["sweptArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sweptArea"] = Number.NaN; }
  try { const v = 0.5 * input.airDensity * (toNumericFormulaValue(results["sweptArea"])) * input.windSpeed ** 3; results["rawPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawPower"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawPower"])) * (input.efficiency / 100); results["power"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["power"] = Number.NaN; }
  return results;
}


export function calculateTurbine_calculator(input: Turbine_calculatorInput): Turbine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["power"]);
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


export interface Turbine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
