// Auto-generated from ghg-protocol-calculator-schema.json
import * as z from 'zod';

export interface Ghg_protocol_calculatorInput {
  electricityKwh: number;
  electricityFactor: number;
  naturalGasM3: number;
  naturalGasFactor: number;
  fuelLiters: number;
  fuelFactor: number;
  dataConfidence?: number;
}

export const Ghg_protocol_calculatorInputSchema = z.object({
  electricityKwh: z.number().default(1000),
  electricityFactor: z.number().default(0.5),
  naturalGasM3: z.number().default(500),
  naturalGasFactor: z.number().default(2),
  fuelLiters: z.number().default(2000),
  fuelFactor: z.number().default(2.3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ghg_protocol_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricityKwh * input.electricityFactor; results["electricityEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["electricityEmissions"] = 0; }
  try { const v = input.naturalGasM3 * input.naturalGasFactor; results["naturalGasEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["naturalGasEmissions"] = 0; }
  try { const v = input.fuelLiters * input.fuelFactor; results["fuelEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelEmissions"] = 0; }
  try { const v = (asFormulaNumber(results["electricityEmissions"])) + (asFormulaNumber(results["naturalGasEmissions"])) + (asFormulaNumber(results["fuelEmissions"])); results["totalEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEmissions"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGhg_protocol_calculator(input: Ghg_protocol_calculatorInput): Ghg_protocol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalEmissions"]);
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


export interface Ghg_protocol_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
