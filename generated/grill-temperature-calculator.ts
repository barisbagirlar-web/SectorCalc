// Auto-generated from grill-temperature-calculator-schema.json
import * as z from 'zod';

export interface Grill_temperature_calculatorInput {
  ambientTemp: number;
  grillArea: number;
  heatInput: number;
  efficiency: number;
  heatTransferCoeff: number;
  dataConfidence?: number;
}

export const Grill_temperature_calculatorInputSchema = z.object({
  ambientTemp: z.number().default(25),
  grillArea: z.number().default(0.5),
  heatInput: z.number().default(2000),
  efficiency: z.number().default(80),
  heatTransferCoeff: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grill_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heatInput * (input.efficiency / 100); results["effectiveHeat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveHeat"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveHeat"])) / (input.grillArea * input.heatTransferCoeff); results["temperatureRise"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["temperatureRise"] = 0; }
  try { const v = input.ambientTemp + (asFormulaNumber(results["temperatureRise"])); results["grillTemperature"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grillTemperature"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGrill_temperature_calculator(input: Grill_temperature_calculatorInput): Grill_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grillTemperature"]);
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


export interface Grill_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
