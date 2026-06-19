// Auto-generated from swim-bike-run-calculator-schema.json
import * as z from 'zod';

export interface Swim_bike_run_calculatorInput {
  swimDistance: number;
  bikeDistance: number;
  runDistance: number;
  swimPace: number;
  bikeSpeed: number;
  runPace: number;
  dataConfidence?: number;
}

export const Swim_bike_run_calculatorInputSchema = z.object({
  swimDistance: z.number().default(400),
  bikeDistance: z.number().default(20),
  runDistance: z.number().default(5),
  swimPace: z.number().default(120),
  bikeSpeed: z.number().default(30),
  runPace: z.number().default(300),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Swim_bike_run_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.swimDistance / 100) * (input.swimPace / 60); results["swimTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["swimTimeMinutes"] = 0; }
  try { const v = (input.bikeDistance / input.bikeSpeed) * 60; results["bikeTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bikeTimeMinutes"] = 0; }
  try { const v = input.runDistance * (input.runPace / 60); results["runTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["runTimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["swimTimeMinutes"])) + (asFormulaNumber(results["bikeTimeMinutes"])) + (asFormulaNumber(results["runTimeMinutes"])); results["totalTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTimeMinutes"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSwim_bike_run_calculator(input: Swim_bike_run_calculatorInput): Swim_bike_run_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalTimeMinutes"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Swim_bike_run_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
