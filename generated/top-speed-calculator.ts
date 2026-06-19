// Auto-generated from top-speed-calculator-schema.json
import * as z from 'zod';

export interface Top_speed_calculatorInput {
  enginePower: number;
  dragCoefficient: number;
  frontalArea: number;
  vehicleMass: number;
  rollingResistanceCoefficient: number;
  airDensity: number;
  drivetrainEfficiency: number;
  dataConfidence?: number;
}

export const Top_speed_calculatorInputSchema = z.object({
  enginePower: z.number().default(100),
  dragCoefficient: z.number().default(0.3),
  frontalArea: z.number().default(2.2),
  vehicleMass: z.number().default(1500),
  rollingResistanceCoefficient: z.number().default(0.015),
  airDensity: z.number().default(1.225),
  drivetrainEfficiency: z.number().default(85),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Top_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.airDensity * input.dragCoefficient * input.frontalArea; results["a"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["a"] = 0; }
  try { const v = input.enginePower * (input.drivetrainEfficiency / 100); results["availablePower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["availablePower"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTop_speed_calculator(input: Top_speed_calculatorInput): Top_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["availablePower"]);
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


export interface Top_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
