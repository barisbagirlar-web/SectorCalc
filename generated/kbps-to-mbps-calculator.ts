// Auto-generated from kbps-to-mbps-calculator-schema.json
import * as z from 'zod';

export interface Kbps_to_mbps_calculatorInput {
  kbps: number;
  conversionStandard: number;
  networkOverhead: number;
  precision: number;
  dataConfidence?: number;
}

export const Kbps_to_mbps_calculatorInputSchema = z.object({
  kbps: z.number().default(1024),
  conversionStandard: z.number().default(0),
  networkOverhead: z.number().default(0),
  precision: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kbps_to_mbps_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kbps * (1 + input.networkOverhead / 100); results["adjustedKbps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedKbps"] = Number.NaN; }
  try { const v = input.conversionStandard === 0 ? 1000 : 1024; results["base"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adjustedKbps"])) / (toNumericFormulaValue(results["base"])); results["rawMbps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawMbps"] = Number.NaN; }
  return results;
}


export function calculateKbps_to_mbps_calculator(input: Kbps_to_mbps_calculatorInput): Kbps_to_mbps_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawMbps"]);
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


export interface Kbps_to_mbps_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
