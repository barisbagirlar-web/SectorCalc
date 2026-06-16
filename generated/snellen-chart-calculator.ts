// Auto-generated from snellen-chart-calculator-schema.json
import * as z from 'zod';

export interface Snellen_chart_calculatorInput {
  testDistance: number;
  optotypeHeight: number;
}

export const Snellen_chart_calculatorInputSchema = z.object({
  testDistance: z.number().default(6),
  optotypeHeight: z.number().default(8.73),
});

function evaluateAllFormulas(input: Snellen_chart_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.optotypeHeight / 1000) / (2 * Math.tan((5/2)/60 * Math.PI/180)); results["standardDistanceM"] = Number.isFinite(v) ? v : 0; } catch { results["standardDistanceM"] = 0; }
  try { const v = input.testDistance / (results["standardDistanceM"] ?? 0); results["visualAcuityDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["visualAcuityDecimal"] = 0; }
  try { const v = Math.round((results["standardDistanceM"] ?? 0) * 10) / 10; results["snellenDenominatorRounded"] = Number.isFinite(v) ? v : 0; } catch { results["snellenDenominatorRounded"] = 0; }
  try { const v = -Math.log10((results["visualAcuityDecimal"] ?? 0)); results["logMAR"] = Number.isFinite(v) ? v : 0; } catch { results["logMAR"] = 0; }
  return results;
}


export function calculateSnellen_chart_calculator(input: Snellen_chart_calculatorInput): Snellen_chart_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["visualAcuityDecimal"] ?? 0;
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


export interface Snellen_chart_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
