// Auto-generated from antenna-calculator-schema.json
import * as z from 'zod';

export interface Antenna_calculatorInput {
  frequency: number;
  diameter: number;
  efficiency: number;
  dataConfidence?: number;
}

export const Antenna_calculatorInputSchema = z.object({
  frequency: z.number().default(2400),
  diameter: z.number().default(0.3),
  efficiency: z.number().default(0.6),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Antenna_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 300 / input.frequency; results["wavelength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wavelength"] = 0; }
  try { const v = 70 * (300 / input.frequency) / input.diameter; results["beamwidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["beamwidth"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAntenna_calculator(input: Antenna_calculatorInput): Antenna_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["beamwidth"]));
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


export interface Antenna_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
