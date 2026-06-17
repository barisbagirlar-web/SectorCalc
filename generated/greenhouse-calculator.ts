// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Greenhouse_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.electricity * input.ef_electricity; results["electricityCO2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["electricityCO2"] = 0; }
  try { const v = input.naturalGas * input.ef_naturalGas; results["naturalGasCO2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["naturalGasCO2"] = 0; }
  try { const v = input.fuelOil * input.ef_fuelOil; results["fuelOilCO2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fuelOilCO2"] = 0; }
  try { const v = (asFormulaNumber(results["electricityCO2"])) + (asFormulaNumber(results["naturalGasCO2"])) + (asFormulaNumber(results["fuelOilCO2"])); results["totalCO2e"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCO2e"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGreenhouse_calculator(input: Greenhouse_calculatorInput): Greenhouse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCO2e"]);
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


export interface Greenhouse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
