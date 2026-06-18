// @ts-nocheck
// Auto-generated from liters-to-gallons-converter-calculator-schema.json
import * as z from 'zod';

export interface Liters_to_gallons_converter_calculatorInput {
  liters: number;
  conversionStandard: string;
  temperatureAdjustment: number;
  batchLossFactor: number;
  includeEvaporation: boolean;
}

export const Liters_to_gallons_converter_calculatorInputSchema = z.object({
  liters: z.number().min(0).max(1000000).default(100),
  conversionStandard: z.enum(['US', 'UK']).default('US'),
  temperatureAdjustment: z.number().min(0.9).max(1.1).default(1),
  batchLossFactor: z.number().min(0).max(10).default(0.5),
  includeEvaporation: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Liters_to_gallons_converter_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.liters * input.temperatureAdjustment * (input.batchLossFactor / 100); results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.liters * input.temperatureAdjustment * (input.batchLossFactor / 100); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLiters_to_gallons_converter_calculator(input: Liters_to_gallons_converter_calculatorInput): Liters_to_gallons_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Liters_to_gallons_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
