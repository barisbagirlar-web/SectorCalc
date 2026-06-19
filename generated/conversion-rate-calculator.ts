// Auto-generated from conversion-rate-calculator-schema.json
import * as z from 'zod';

export interface Conversion_rate_calculatorInput {
  rawMaterialInput: number;
  finishedProductOutput: number;
  reworkOutput: number;
  scrap: number;
  dataConfidence?: number;
}

export const Conversion_rate_calculatorInputSchema = z.object({
  rawMaterialInput: z.number().default(1000),
  finishedProductOutput: z.number().default(900),
  reworkOutput: z.number().default(50),
  scrap: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Conversion_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.finishedProductOutput + input.reworkOutput) / input.rawMaterialInput) * 100; results["overallConversionRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overallConversionRate"] = 0; }
  try { const v = (input.finishedProductOutput / input.rawMaterialInput) * 100; results["yield"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yield"] = 0; }
  try { const v = (input.reworkOutput / input.rawMaterialInput) * 100; results["reworkRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reworkRate"] = 0; }
  try { const v = (input.scrap / input.rawMaterialInput) * 100; results["scrapRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scrapRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConversion_rate_calculator(input: Conversion_rate_calculatorInput): Conversion_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallConversionRate"]);
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


export interface Conversion_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
