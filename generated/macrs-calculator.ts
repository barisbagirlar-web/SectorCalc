// Auto-generated from macrs-calculator-schema.json
import * as z from 'zod';

export interface Macrs_calculatorInput {
  assetCost: number;
  bonusPercentage: number;
  section179: number;
  macrsRateYear1: number;
  recoveryPeriod: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Macrs_calculatorInputSchema = z.object({
  assetCost: z.number().default(100000),
  bonusPercentage: z.number().default(0),
  section179: z.number().default(0),
  macrsRateYear1: z.number().default(20),
  recoveryPeriod: z.number().default(5),
  taxRate: z.number().default(21),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Macrs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.assetCost - input.section179 - (input.assetCost * input.bonusPercentage / 100); results["depreciableBasis"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["depreciableBasis"] = 0; }
  try { const v = (asFormulaNumber(results["depreciableBasis"])) * input.macrsRateYear1 / 100; results["firstYearDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["firstYearDepreciation"] = 0; }
  try { const v = (asFormulaNumber(results["firstYearDepreciation"])) * input.taxRate / 100; results["taxSavings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxSavings"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMacrs_calculator(input: Macrs_calculatorInput): Macrs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["firstYearDepreciation"]);
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


export interface Macrs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
