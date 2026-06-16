// Auto-generated from trimmed-mean-calculator-schema.json
import * as z from 'zod';

export interface Trimmed_mean_calculatorInput {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  trimPercent: number;
}

export const Trimmed_mean_calculatorInputSchema = z.object({
  value1: z.number().default(10),
  value2: z.number().default(20),
  value3: z.number().default(30),
  value4: z.number().default(40),
  value5: z.number().default(50),
  trimPercent: z.number().default(20),
});

function evaluateAllFormulas(input: Trimmed_mean_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function(vals, pct) { var sorted = vals.filter(v => !isNaN(v)).sort((a,b)=>a-b); var n = sorted.length; var k = Math.floor(n * Math.min(50, Math.max(0, pct)) / 100); var trimmed = sorted.slice(k, n - k); var sum = trimmed.reduce((s,v) => s + v, 0); var count = trimmed.length; return count > 0 ? sum / count : 0; })([value1, value2, value3, value4, value5], trimPercent); results["trimmedMean"] = Number.isFinite(v) ? v : 0; } catch { results["trimmedMean"] = 0; }
  try { const v = (function(vals) { var arr = vals.filter(v => !isNaN(v)); var sum = arr.reduce((s,v) => s + v, 0); var n = arr.length; return n > 0 ? sum / n : 0; })([value1, value2, value3, value4, value5]); results["originalMean"] = Number.isFinite(v) ? v : 0; } catch { results["originalMean"] = 0; }
  try { const v = (function(vals, pct) { var sorted = vals.filter(v => !isNaN(v)).sort((a,b)=>a-b); var n = sorted.length; var k = Math.floor(n * Math.min(50, Math.max(0, pct)) / 100); var trimmed = sorted.slice(k, n - k); return trimmed.length; })([value1, value2, value3, value4, value5], trimPercent); results["countUsed"] = Number.isFinite(v) ? v : 0; } catch { results["countUsed"] = 0; }
  return results;
}


export function calculateTrimmed_mean_calculator(input: Trimmed_mean_calculatorInput): Trimmed_mean_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["trimmedMean"] ?? 0;
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


export interface Trimmed_mean_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
