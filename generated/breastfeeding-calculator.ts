// Auto-generated from breastfeeding-calculator-schema.json
import * as z from 'zod';

export interface Breastfeeding_calculatorInput {
  babyWeight: number;
  dailyFeeds: number;
  milkDensity: number;
  wastageFactor: number;
  dataConfidence?: number;
}

export const Breastfeeding_calculatorInputSchema = z.object({
  babyWeight: z.number().default(3.5),
  dailyFeeds: z.number().default(8),
  milkDensity: z.number().default(1.03),
  wastageFactor: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Breastfeeding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.babyWeight * 150; results["dailyVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyVolume"])) / input.dailyFeeds; results["perFeedVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perFeedVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyVolume"])) * input.milkDensity; results["totalMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyVolume"])) / (1 - input.wastageFactor / 100); results["productionVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["productionVolume"] = Number.NaN; }
  return results;
}


export function calculateBreastfeeding_calculator(input: Breastfeeding_calculatorInput): Breastfeeding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyVolume"]);
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


export interface Breastfeeding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
