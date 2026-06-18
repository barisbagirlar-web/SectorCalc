// @ts-nocheck
// Auto-generated from mbps-to-gbps-calculator-schema.json
import * as z from 'zod';

export interface Mbps_to_gbps_calculatorInput {
  mbpsValue: number;
  conversionFactor: number;
  decimalPrecision: number;
  calibrationOffset: number;
  measurementId: number;
}

export const Mbps_to_gbps_calculatorInputSchema = z.object({
  mbpsValue: z.number().default(1000),
  conversionFactor: z.number().default(1000),
  decimalPrecision: z.number().default(2),
  calibrationOffset: z.number().default(0),
  measurementId: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mbps_to_gbps_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.mbpsValue; results["adjustedMbps"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedMbps"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedMbps"])) / input.conversionFactor; results["rawGbps"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawGbps"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMbps_to_gbps_calculator(input: Mbps_to_gbps_calculatorInput): Mbps_to_gbps_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawGbps"]);
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


export interface Mbps_to_gbps_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
