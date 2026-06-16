// Auto-generated from conversion-rate-calculator-schema.json
import * as z from 'zod';

export interface Conversion_rate_calculatorInput {
  rawMaterialInput: number;
  finishedProductOutput: number;
  reworkOutput: number;
  scrap: number;
}

export const Conversion_rate_calculatorInputSchema = z.object({
  rawMaterialInput: z.number().default(1000),
  finishedProductOutput: z.number().default(900),
  reworkOutput: z.number().default(50),
  scrap: z.number().default(50),
});

function evaluateAllFormulas(input: Conversion_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.finishedProductOutput + input.reworkOutput) / input.rawMaterialInput) * 100; results["overallConversionRate"] = Number.isFinite(v) ? v : 0; } catch { results["overallConversionRate"] = 0; }
  try { const v = (input.finishedProductOutput / input.rawMaterialInput) * 100; results["yield"] = Number.isFinite(v) ? v : 0; } catch { results["yield"] = 0; }
  try { const v = (input.reworkOutput / input.rawMaterialInput) * 100; results["reworkRate"] = Number.isFinite(v) ? v : 0; } catch { results["reworkRate"] = 0; }
  try { const v = (input.scrap / input.rawMaterialInput) * 100; results["scrapRate"] = Number.isFinite(v) ? v : 0; } catch { results["scrapRate"] = 0; }
  return results;
}


export function calculateConversion_rate_calculator(input: Conversion_rate_calculatorInput): Conversion_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overallConversionRate"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
