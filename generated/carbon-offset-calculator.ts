// Auto-generated from carbon-offset-calculator-schema.json
import * as z from 'zod';

export interface Carbon_offset_calculatorInput {
  electricityUsage: number;
  naturalGasUsage: number;
  vehicleMiles: number;
  flightMiles: number;
  wasteGeneration: number;
  waterUsage: number;
  dataConfidence?: number;
}

export const Carbon_offset_calculatorInputSchema = z.object({
  electricityUsage: z.number().default(10000),
  naturalGasUsage: z.number().default(1000),
  vehicleMiles: z.number().default(12000),
  flightMiles: z.number().default(5000),
  wasteGeneration: z.number().default(2000),
  waterUsage: z.number().default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Carbon_offset_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricityUsage * 0.000233; results["electricity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["electricity"] = Number.NaN; }
  try { const v = input.naturalGasUsage * 0.0053; results["naturalGas"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["naturalGas"] = Number.NaN; }
  try { const v = input.vehicleMiles * 0.000411; results["vehicle"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vehicle"] = Number.NaN; }
  try { const v = input.flightMiles * 0.00024; results["flights"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flights"] = Number.NaN; }
  try { const v = input.wasteGeneration * 0.00025; results["waste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waste"] = Number.NaN; }
  try { const v = input.waterUsage * 0.000001; results["water"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["water"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["electricity"])) + (toNumericFormulaValue(results["naturalGas"])) + (toNumericFormulaValue(results["vehicle"])) + (toNumericFormulaValue(results["flights"])) + (toNumericFormulaValue(results["waste"])) + (toNumericFormulaValue(results["water"])); results["totalEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEmissions"] = Number.NaN; }
  return results;
}


export function calculateCarbon_offset_calculator(input: Carbon_offset_calculatorInput): Carbon_offset_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalEmissions"]);
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


export interface Carbon_offset_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
