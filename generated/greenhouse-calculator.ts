// Auto-generated from greenhouse-calculator-schema.json
import * as z from 'zod';

export interface Greenhouse_calculatorInput {
  electricity: number;
  ef_electricity: number;
  naturalGas: number;
  ef_naturalGas: number;
  fuelOil: number;
  ef_fuelOil: number;
  dataConfidence?: number;
}

export const Greenhouse_calculatorInputSchema = z.object({
  electricity: z.number().default(1000),
  ef_electricity: z.number().default(0.475),
  naturalGas: z.number().default(100),
  ef_naturalGas: z.number().default(1.9),
  fuelOil: z.number().default(100),
  ef_fuelOil: z.number().default(2.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Greenhouse_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricity * input.ef_electricity; results["electricityCO2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["electricityCO2"] = Number.NaN; }
  try { const v = input.naturalGas * input.ef_naturalGas; results["naturalGasCO2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["naturalGasCO2"] = Number.NaN; }
  try { const v = input.fuelOil * input.ef_fuelOil; results["fuelOilCO2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelOilCO2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["electricityCO2"])) + (toNumericFormulaValue(results["naturalGasCO2"])) + (toNumericFormulaValue(results["fuelOilCO2"])); results["totalCO2e"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCO2e"] = Number.NaN; }
  return results;
}


export function calculateGreenhouse_calculator(input: Greenhouse_calculatorInput): Greenhouse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCO2e"]);
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


export interface Greenhouse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
