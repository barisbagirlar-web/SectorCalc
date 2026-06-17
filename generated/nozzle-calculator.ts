// @ts-nocheck
// Auto-generated from nozzle-calculator-schema.json
import * as z from 'zod';

export interface Nozzle_calculatorInput {
  pressureDrop: number;
  diameter: number;
  dischargeCoefficient: number;
  density: number;
  viscosity: number;
}

export const Nozzle_calculatorInputSchema = z.object({
  pressureDrop: z.number().default(1),
  diameter: z.number().default(10),
  dischargeCoefficient: z.number().default(0.98),
  density: z.number().default(1000),
  viscosity: z.number().default(0.000001),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Nozzle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Math.PI * (input.diameter / 1000) ** 2 / 4; results["area"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["area"] = 0; }
  try { const v = input.pressureDrop * 100000; results["deltaP_Pa"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deltaP_Pa"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNozzle_calculator(input: Nozzle_calculatorInput): Nozzle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deltaP_Pa"]);
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


export interface Nozzle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
