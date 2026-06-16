// Auto-generated from histogram-calculator-schema.json
import * as z from 'zod';

export interface Histogram_calculatorInput {
  numberOfDataPoints: number;
  dataMin: number;
  dataMax: number;
  dataStdDev: number;
  dataIQR: number;
}

export const Histogram_calculatorInputSchema = z.object({
  numberOfDataPoints: z.number().default(100),
  dataMin: z.number().default(0),
  dataMax: z.number().default(100),
  dataStdDev: z.number().default(15),
  dataIQR: z.number().default(20),
});

function evaluateAllFormulas(input: Histogram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(1 + 3.322 * Math.log10(input.numberOfDataPoints)); results["sturgesBinCount"] = Number.isFinite(v) ? v : 0; } catch { results["sturgesBinCount"] = 0; }
  try { const v = (input.dataMax - input.dataMin) / (results["sturgesBinCount"] ?? 0); results["sturgesBinWidth"] = Number.isFinite(v) ? v : 0; } catch { results["sturgesBinWidth"] = 0; }
  try { const v = 3.5 * input.dataStdDev / Math.pow(input.numberOfDataPoints, 1/3); results["scottBinWidth"] = Number.isFinite(v) ? v : 0; } catch { results["scottBinWidth"] = 0; }
  try { const v = Math.ceil((input.dataMax - input.dataMin) / (results["scottBinWidth"] ?? 0)); results["scottBinCount"] = Number.isFinite(v) ? v : 0; } catch { results["scottBinCount"] = 0; }
  try { const v = 2 * input.dataIQR / Math.pow(input.numberOfDataPoints, 1/3); results["fdBinWidth"] = Number.isFinite(v) ? v : 0; } catch { results["fdBinWidth"] = 0; }
  try { const v = Math.ceil((input.dataMax - input.dataMin) / (results["fdBinWidth"] ?? 0)); results["fdBinCount"] = Number.isFinite(v) ? v : 0; } catch { results["fdBinCount"] = 0; }
  return results;
}


export function calculateHistogram_calculator(input: Histogram_calculatorInput): Histogram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sturgesBinCount"] ?? 0;
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


export interface Histogram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
