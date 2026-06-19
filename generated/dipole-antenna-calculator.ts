// Auto-generated from dipole-antenna-calculator-schema.json
import * as z from 'zod';

export interface Dipole_antenna_calculatorInput {
  frequency: number;
  velocityFactor: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Dipole_antenna_calculatorInputSchema = z.object({
  frequency: z.number().default(145.5),
  velocityFactor: z.number().default(0.95),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dipole_antenna_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (300 / input.frequency); results["wavelength_m"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wavelength_m"] = 0; }
  try { const v = (300 / input.frequency) * 0.5 * input.velocityFactor; results["dipoleLength_m"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dipoleLength_m"] = 0; }
  try { const v = (300 / input.frequency) * 0.5 * input.velocityFactor * 3.28084; results["dipoleLength_ft"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dipoleLength_ft"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDipole_antenna_calculator(input: Dipole_antenna_calculatorInput): Dipole_antenna_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dipoleLength_m"]);
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


export interface Dipole_antenna_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
