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

function evaluateAllFormulas(input: Carbon_intensity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricityConsumption * input.electricityEmissionFactor + input.naturalGasConsumption * input.naturalGasEmissionFactor + input.dieselConsumption * input.dieselEmissionFactor; results["totalEmissions"] = Number.isFinite(v) ? v : 0; } catch { results["totalEmissions"] = 0; }
  try { const v = input.electricityConsumption * input.electricityEmissionFactor; results["electricityEmissions"] = Number.isFinite(v) ? v : 0; } catch { results["electricityEmissions"] = 0; }
  try { const v = input.naturalGasConsumption * input.naturalGasEmissionFactor; results["naturalGasEmissions"] = Number.isFinite(v) ? v : 0; } catch { results["naturalGasEmissions"] = 0; }
  try { const v = input.dieselConsumption * input.dieselEmissionFactor; results["dieselEmissions"] = Number.isFinite(v) ? v : 0; } catch { results["dieselEmissions"] = 0; }
  try { const v = (results["totalEmissions"] ?? 0) / input.productionOutput; results["carbonIntensity"] = Number.isFinite(v) ? v : 0; } catch { results["carbonIntensity"] = 0; }
  return results;
}


export function calculateCarbon_intensity_calculator(input: Carbon_intensity_calculatorInput): Carbon_intensity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["carbonIntensity"] ?? 0;
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


export interface Carbon_intensity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
