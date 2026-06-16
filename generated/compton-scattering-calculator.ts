// Auto-generated from compton-scattering-calculator-schema.json
import * as z from 'zod';

export interface Compton_scattering_calculatorInput {
  incidentEnergy: number;
  incidentWavelength: number;
  scatteringAngle: number;
  electronRestEnergy: number;
}

export const Compton_scattering_calculatorInputSchema = z.object({
  incidentEnergy: z.number().default(100),
  incidentWavelength: z.number().default(0),
  scatteringAngle: z.number().default(90),
  electronRestEnergy: z.number().default(511),
});

function evaluateAllFormulas(input: Compton_scattering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scatteringAngle * Math.PI / 180; results["thetaRad"] = Number.isFinite(v) ? v : 0; } catch { results["thetaRad"] = 0; }
  try { const v = (input.incidentWavelength > 0) ? (1.24 / input.incidentWavelength) : input.incidentEnergy; results["incidentEnergyKeV"] = Number.isFinite(v) ? v : 0; } catch { results["incidentEnergyKeV"] = 0; }
  try { const v = (results["incidentEnergyKeV"] ?? 0) / (1 + ((results["incidentEnergyKeV"] ?? 0) / input.electronRestEnergy) * (1 - Math.cos((results["thetaRad"] ?? 0)))); results["scatteredEnergyKeV"] = Number.isFinite(v) ? v : 0; } catch { results["scatteredEnergyKeV"] = 0; }
  try { const v = (results["incidentEnergyKeV"] ?? 0) - (results["scatteredEnergyKeV"] ?? 0); results["electronEnergyKeV"] = Number.isFinite(v) ? v : 0; } catch { results["electronEnergyKeV"] = 0; }
  try { const v = (input.incidentWavelength > 0) ? input.incidentWavelength : (1.24 / (results["incidentEnergyKeV"] ?? 0)); results["incidentWavelengthNm"] = Number.isFinite(v) ? v : 0; } catch { results["incidentWavelengthNm"] = 0; }
  try { const v = 1.24 / (results["scatteredEnergyKeV"] ?? 0); results["scatteredWavelengthNm"] = Number.isFinite(v) ? v : 0; } catch { results["scatteredWavelengthNm"] = 0; }
  return results;
}


export function calculateCompton_scattering_calculator(input: Compton_scattering_calculatorInput): Compton_scattering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["scatteredEnergyKeV"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
