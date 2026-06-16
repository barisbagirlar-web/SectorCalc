// Auto-generated from dilution-calculator-schema.json
import * as z from 'zod';

export interface Dilution_calculatorInput {
  stockConcentration: number;
  desiredConcentration: number;
  finalVolume: number;
  overagePercent: number;
  unitConversionFactor: number;
}

export const Dilution_calculatorInputSchema = z.object({
  stockConcentration: z.number().default(100),
  desiredConcentration: z.number().default(10),
  finalVolume: z.number().default(100),
  overagePercent: z.number().default(0),
  unitConversionFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Dilution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stockConcentration * input.unitConversionFactor; results["effectiveStockConcentration"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveStockConcentration"] = 0; }
  try { const v = input.finalVolume * (1 + input.overagePercent / 100); results["adjustedFinalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedFinalVolume"] = 0; }
  try { const v = (input.desiredConcentration * (results["adjustedFinalVolume"] ?? 0)) / (results["effectiveStockConcentration"] ?? 0); results["requiredStockVolume"] = Number.isFinite(v) ? v : 0; } catch { results["requiredStockVolume"] = 0; }
  return results;
}


export function calculateDilution_calculator(input: Dilution_calculatorInput): Dilution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredStockVolume"] ?? 0;
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


export interface Dilution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
