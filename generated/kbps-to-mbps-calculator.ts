// @ts-nocheck
// Auto-generated from kbps-to-mbps-calculator-schema.json
import * as z from 'zod';

export interface Kbps_to_mbps_calculatorInput {
  kbps: number;
  conversionStandard: number;
  networkOverhead: number;
  precision: number;
}

export const Kbps_to_mbps_calculatorInputSchema = z.object({
  kbps: z.number().default(1024),
  conversionStandard: z.number().default(0),
  networkOverhead: z.number().default(0),
  precision: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kbps_to_mbps_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.kbps * (1 + input.networkOverhead / 100); results["adjustedKbps"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedKbps"] = 0; }
  try { const v = input.conversionStandard === 0 ? 1000 : 1024; results["base"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedKbps"])) / (asFormulaNumber(results["base"])); results["rawMbps"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawMbps"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateKbps_to_mbps_calculator(input: Kbps_to_mbps_calculatorInput): Kbps_to_mbps_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawMbps"]);
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


export interface Kbps_to_mbps_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
