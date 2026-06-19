// Auto-generated from polarization-calculator-schema.json
import * as z from 'zod';

export interface Polarization_calculatorInput {
  incident_intensity: number;
  incident_angle: number;
  polarizer1_angle: number;
  polarizer2_angle: number;
  dataConfidence?: number;
}

export const Polarization_calculatorInputSchema = z.object({
  incident_intensity: z.number().default(1),
  incident_angle: z.number().default(0),
  polarizer1_angle: z.number().default(0),
  polarizer2_angle: z.number().default(45),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Polarization_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.incident_intensity * input.incident_angle * input.polarizer1_angle * input.polarizer2_angle; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.incident_intensity * input.incident_angle * input.polarizer1_angle * input.polarizer2_angle; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePolarization_calculator(input: Polarization_calculatorInput): Polarization_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Polarization_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
