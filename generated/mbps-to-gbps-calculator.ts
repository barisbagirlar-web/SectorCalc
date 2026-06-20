// Auto-generated from mbps-to-gbps-calculator-schema.json
import * as z from 'zod';

export interface Mbps_to_gbps_calculatorInput {
  mbpsValue: number;
  conversionFactor: number;
  decimalPrecision: number;
  calibrationOffset: number;
  measurementId: number;
  dataConfidence?: number;
}

export const Mbps_to_gbps_calculatorInputSchema = z.object({
  mbpsValue: z.number().default(1000),
  conversionFactor: z.number().default(1000),
  decimalPrecision: z.number().default(2),
  calibrationOffset: z.number().default(0),
  measurementId: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mbps_to_gbps_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mbpsValue + input.calibrationOffset; results["adjustedMbps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedMbps"] = Number.NaN; }
  try { const v = (input.mbpsValue + input.calibrationOffset) / input.conversionFactor; results["rawGbps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawGbps"] = Number.NaN; }
  return results;
}


export function calculateMbps_to_gbps_calculator(input: Mbps_to_gbps_calculatorInput): Mbps_to_gbps_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawGbps"]);
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


export interface Mbps_to_gbps_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
