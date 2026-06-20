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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Carbon_intensity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricityConsumption * input.electricityEmissionFactor + input.naturalGasConsumption * input.naturalGasEmissionFactor + input.dieselConsumption * input.dieselEmissionFactor; results["totalEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEmissions"] = Number.NaN; }
  try { const v = input.electricityConsumption * input.electricityEmissionFactor; results["electricityEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["electricityEmissions"] = Number.NaN; }
  try { const v = input.naturalGasConsumption * input.naturalGasEmissionFactor; results["naturalGasEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["naturalGasEmissions"] = Number.NaN; }
  try { const v = input.dieselConsumption * input.dieselEmissionFactor; results["dieselEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dieselEmissions"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalEmissions"])) / input.productionOutput; results["carbonIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbonIntensity"] = Number.NaN; }
  return results;
}


export function calculateCarbon_intensity_calculator(input: Carbon_intensity_calculatorInput): Carbon_intensity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["carbonIntensity"]);
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


export interface Carbon_intensity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
