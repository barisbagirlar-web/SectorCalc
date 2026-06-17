// @ts-nocheck
// Auto-generated from carbon-intensity-calculator-schema.json
import * as z from 'zod';

export interface Carbon_intensity_calculatorInput {
  electricityConsumption: number;
  naturalGasConsumption: number;
  dieselConsumption: number;
  productionOutput: number;
  electricityEmissionFactor: number;
  naturalGasEmissionFactor: number;
  dieselEmissionFactor: number;
}

export const Carbon_intensity_calculatorInputSchema = z.object({
  electricityConsumption: z.number().default(1000),
  naturalGasConsumption: z.number().default(500),
  dieselConsumption: z.number().default(100),
  productionOutput: z.number().default(1000),
  electricityEmissionFactor: z.number().default(0.5),
  naturalGasEmissionFactor: z.number().default(2),
  dieselEmissionFactor: z.number().default(2.7),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Carbon_intensity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.electricityConsumption * input.electricityEmissionFactor + input.naturalGasConsumption * input.naturalGasEmissionFactor + input.dieselConsumption * input.dieselEmissionFactor; results["totalEmissions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalEmissions"] = 0; }
  try { const v = input.electricityConsumption * input.electricityEmissionFactor; results["electricityEmissions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["electricityEmissions"] = 0; }
  try { const v = input.naturalGasConsumption * input.naturalGasEmissionFactor; results["naturalGasEmissions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["naturalGasEmissions"] = 0; }
  try { const v = input.dieselConsumption * input.dieselEmissionFactor; results["dieselEmissions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dieselEmissions"] = 0; }
  try { const v = (asFormulaNumber(results["totalEmissions"])) / input.productionOutput; results["carbonIntensity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carbonIntensity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCarbon_intensity_calculator(input: Carbon_intensity_calculatorInput): Carbon_intensity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["carbonIntensity"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Carbon_intensity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
