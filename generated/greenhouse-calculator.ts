// Auto-generated from greenhouse-calculator-schema.json
import * as z from 'zod';

export interface Greenhouse_calculatorInput {
  electricity: number;
  ef_electricity: number;
  naturalGas: number;
  ef_naturalGas: number;
  fuelOil: number;
  ef_fuelOil: number;
}

export const Greenhouse_calculatorInputSchema = z.object({
  electricity: z.number().default(1000),
  ef_electricity: z.number().default(0.475),
  naturalGas: z.number().default(100),
  ef_naturalGas: z.number().default(1.9),
  fuelOil: z.number().default(100),
  ef_fuelOil: z.number().default(2.5),
});

function evaluateAllFormulas(input: Greenhouse_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricity * input.ef_electricity; results["electricityCO2"] = Number.isFinite(v) ? v : 0; } catch { results["electricityCO2"] = 0; }
  try { const v = input.naturalGas * input.ef_naturalGas; results["naturalGasCO2"] = Number.isFinite(v) ? v : 0; } catch { results["naturalGasCO2"] = 0; }
  try { const v = input.fuelOil * input.ef_fuelOil; results["fuelOilCO2"] = Number.isFinite(v) ? v : 0; } catch { results["fuelOilCO2"] = 0; }
  try { const v = (results["electricityCO2"] ?? 0) + (results["naturalGasCO2"] ?? 0) + (results["fuelOilCO2"] ?? 0); results["totalCO2e"] = Number.isFinite(v) ? v : 0; } catch { results["totalCO2e"] = 0; }
  return results;
}


export function calculateGreenhouse_calculator(input: Greenhouse_calculatorInput): Greenhouse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCO2e"] ?? 0;
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


export interface Greenhouse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
