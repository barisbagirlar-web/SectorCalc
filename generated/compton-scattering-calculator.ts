// Auto-generated from compton-scattering-calculator-schema.json
import * as z from 'zod';

export interface Compton_scattering_calculatorInput {
  incidentEnergy: number;
  incidentWavelength: number;
  scatteringAngle: number;
  electronRestEnergy: number;
  dataConfidence?: number;
}

export const Compton_scattering_calculatorInputSchema = z.object({
  incidentEnergy: z.number().default(100),
  incidentWavelength: z.number().default(0),
  scatteringAngle: z.number().default(90),
  electronRestEnergy: z.number().default(511),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compton_scattering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scatteringAngle * Math.PI / 180; results["thetaRad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["thetaRad"] = 0; }
  try { const v = (input.incidentWavelength > 0) ? (1.24 / input.incidentWavelength) : input.incidentEnergy; results["incidentEnergyKeV"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["incidentEnergyKeV"] = 0; }
  try { const v = (input.incidentWavelength > 0) ? input.incidentWavelength : (1.24 / (asFormulaNumber(results["incidentEnergyKeV"]))); results["incidentWavelengthNm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["incidentWavelengthNm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCompton_scattering_calculator(input: Compton_scattering_calculatorInput): Compton_scattering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["incidentWavelengthNm"]);
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


export interface Compton_scattering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
