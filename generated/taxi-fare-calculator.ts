// @ts-nocheck
// Auto-generated from taxi-fare-calculator-schema.json
import * as z from 'zod';

export interface Taxi_fare_calculatorInput {
  baseFare: number;
  costPerKm: number;
  costPerMinute: number;
  distance: number;
  time: number;
  surcharge: number;
}

export const Taxi_fare_calculatorInputSchema = z.object({
  baseFare: z.number().default(3),
  costPerKm: z.number().default(1.5),
  costPerMinute: z.number().default(0.25),
  distance: z.number().default(10),
  time: z.number().default(15),
  surcharge: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Taxi_fare_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.distance * input.costPerKm; results["distanceCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["distanceCost"] = 0; }
  try { const v = input.time * input.costPerMinute; results["timeCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["timeCost"] = 0; }
  try { const v = input.baseFare; results["baseFare"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseFare"] = 0; }
  try { const v = input.surcharge; results["surcharge"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["surcharge"] = 0; }
  try { const v = input.baseFare + input.distance * input.costPerKm + input.time * input.costPerMinute + input.surcharge; results["totalFare"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFare"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTaxi_fare_calculator(input: Taxi_fare_calculatorInput): Taxi_fare_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFare"]);
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


export interface Taxi_fare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
