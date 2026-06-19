// Auto-generated from dipole-antenna-length-calculator-schema.json
import * as z from 'zod';

export interface Dipole_antenna_length_calculatorInput {
  frequency: number;
  velocityFactor: number;
  wavelengthFraction: number;
  unitSelection: number;
  endEffectCorrection: number;
  dataConfidence?: number;
}

export const Dipole_antenna_length_calculatorInputSchema = z.object({
  frequency: z.number().default(100),
  velocityFactor: z.number().default(0.95),
  wavelengthFraction: z.number().default(0.5),
  unitSelection: z.number().default(0),
  endEffectCorrection: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dipole_antenna_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 492 * input.velocityFactor * input.wavelengthFraction * input.endEffectCorrection / input.frequency; results["lengthFeet"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lengthFeet"] = 0; }
  try { const v = 300 * input.velocityFactor * input.wavelengthFraction * input.endEffectCorrection / input.frequency; results["lengthMeters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lengthMeters"] = 0; }
  try { const v = input.unitSelection === 0 ? 492 * input.velocityFactor * input.wavelengthFraction * input.endEffectCorrection / input.frequency : 300 * input.velocityFactor * input.wavelengthFraction * input.endEffectCorrection / input.frequency; results["lengthInSelectedUnit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lengthInSelectedUnit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDipole_antenna_length_calculator(input: Dipole_antenna_length_calculatorInput): Dipole_antenna_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["lengthInSelectedUnit"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Dipole_antenna_length_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
