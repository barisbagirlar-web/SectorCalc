// Auto-generated from kibibytes-to-kilobytes-calculator-schema.json
import * as z from 'zod';

export interface Kibibytes_to_kilobytes_calculatorInput {
  kibibytes: number;
  decimalPlaces: number;
  redundancyFactor: number;
  overheadPercent: number;
  dataConfidence?: number;
}

export const Kibibytes_to_kilobytes_calculatorInputSchema = z.object({
  kibibytes: z.number().default(1),
  decimalPlaces: z.number().default(2),
  redundancyFactor: z.number().default(1),
  overheadPercent: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kibibytes_to_kilobytes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kibibytes * 1.024; results["rawKilobytes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawKilobytes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawKilobytes"])) * (1 + input.overheadPercent / 100); results["withOverhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["withOverhead"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["withOverhead"])) * input.redundancyFactor; results["withRedundancy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["withRedundancy"] = Number.NaN; }
  return results;
}


export function calculateKibibytes_to_kilobytes_calculator(input: Kibibytes_to_kilobytes_calculatorInput): Kibibytes_to_kilobytes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["withRedundancy"]);
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


export interface Kibibytes_to_kilobytes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
