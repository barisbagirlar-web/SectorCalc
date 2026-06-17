// @ts-nocheck
// Auto-generated from stere-to-cubic-meters-calculator-schema.json
import * as z from 'zod';

export interface Stere_to_cubic_meters_calculatorInput {
  quantity: number;
  conversionFactor: number;
  stackingFactor: number;
  pricePerStere: number;
  pricePerCubicMeter: number;
  roundingPrecision: number;
}

export const Stere_to_cubic_meters_calculatorInputSchema = z.object({
  quantity: z.number().default(1),
  conversionFactor: z.number().default(1),
  stackingFactor: z.number().default(1),
  pricePerStere: z.number().default(0),
  pricePerCubicMeter: z.number().default(0),
  roundingPrecision: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stere_to_cubic_meters_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.quantity * input.conversionFactor * input.stackingFactor; results["rawVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawVolume"] = 0; }
  try { const v = input.pricePerStere * input.quantity; results["totalCostStere"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCostStere"] = 0; }
  try { const v = input.pricePerCubicMeter * input.quantity * input.conversionFactor * input.stackingFactor; results["totalCostCubicMeter"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCostCubicMeter"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStere_to_cubic_meters_calculator(input: Stere_to_cubic_meters_calculatorInput): Stere_to_cubic_meters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostCubicMeter"]);
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


export interface Stere_to_cubic_meters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
