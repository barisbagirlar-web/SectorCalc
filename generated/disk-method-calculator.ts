// Auto-generated from disk-method-calculator-schema.json
import * as z from 'zod';

export interface Disk_method_calculatorInput {
  lowerBound: number;
  upperBound: number;
  coeffA: number;
  coeffB: number;
  coeffC: number;
  dataConfidence?: number;
}

export const Disk_method_calculatorInputSchema = z.object({
  lowerBound: z.number().default(0),
  upperBound: z.number().default(2),
  coeffA: z.number().default(1),
  coeffB: z.number().default(0),
  coeffC: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Disk_method_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coeffA**2*(input.upperBound**5 - input.lowerBound**5)/5 + 2*input.coeffA*input.coeffB*(input.upperBound**4 - input.lowerBound**4)/4 + (2*input.coeffA*input.coeffC + input.coeffB**2)*(input.upperBound**3 - input.lowerBound**3)/3 + 2*input.coeffB*input.coeffC*(input.upperBound**2 - input.lowerBound**2)/2 + input.coeffC**2*(input.upperBound - input.lowerBound); results["integral"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["integral"] = 0; }
  try { const v = Math.PI * (asFormulaNumber(results["integral"])); results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = input.coeffA*((input.lowerBound+input.upperBound)/2)**2 + input.coeffB*(input.lowerBound+input.upperBound)/2 + input.coeffC; results["midRadius"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["midRadius"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDisk_method_calculator(input: Disk_method_calculatorInput): Disk_method_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["volume"]);
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


export interface Disk_method_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
