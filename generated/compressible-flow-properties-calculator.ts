// Auto-generated from compressible-flow-properties-calculator-schema.json
import * as z from 'zod';

export interface Compressible_flow_properties_calculatorInput {
  machNumber: number;
  gamma: number;
  staticTemperature: number;
  staticPressure: number;
  gasConstant: number;
  dataConfidence?: number;
}

export const Compressible_flow_properties_calculatorInputSchema = z.object({
  machNumber: z.number().default(1.5),
  gamma: z.number().default(1.4),
  staticTemperature: z.number().default(300),
  staticPressure: z.number().default(101325),
  gasConstant: z.number().default(287),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compressible_flow_properties_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.staticTemperature * (1 + ((input.gamma - 1) / 2) * input.machNumber ** 2); results["stagnationTemperature"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stagnationTemperature"] = 0; }
  try { const v = input.staticPressure * (1 + ((input.gamma - 1) / 2) * input.machNumber ** 2) ** (input.gamma / (input.gamma - 1)); results["stagnationPressure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stagnationPressure"] = 0; }
  try { const v = input.staticPressure / (input.gasConstant * input.staticTemperature); results["density"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["density"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCompressible_flow_properties_calculator(input: Compressible_flow_properties_calculatorInput): Compressible_flow_properties_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["stagnationPressure"]);
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


export interface Compressible_flow_properties_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
