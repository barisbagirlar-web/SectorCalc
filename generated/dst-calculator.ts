// @ts-nocheck
// Auto-generated from dst-calculator-schema.json
import * as z from 'zod';

export interface Dst_calculatorInput {
  distance: number;
  averageSpeed: number;
  fuelConsumption: number;
  fuelPrice: number;
  numStops: number;
  stopTime: number;
}

export const Dst_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  averageSpeed: z.number().default(60),
  fuelConsumption: z.number().default(30),
  fuelPrice: z.number().default(1.5),
  numStops: z.number().default(0),
  stopTime: z.number().default(15),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dst_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.distance / input.averageSpeed; results["travelTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["travelTime"] = 0; }
  try { const v = (asFormulaNumber(results["travelTime"])) + (input.numStops * input.stopTime / 60); results["totalTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTime"] = 0; }
  try { const v = (input.distance / 100) * input.fuelConsumption; results["fuelConsumed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fuelConsumed"] = 0; }
  try { const v = (asFormulaNumber(results["fuelConsumed"])) * input.fuelPrice; results["fuelCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fuelCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDst_calculator(input: Dst_calculatorInput): Dst_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTime"]);
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


export interface Dst_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
