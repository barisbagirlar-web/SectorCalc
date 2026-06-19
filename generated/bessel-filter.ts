// Auto-generated from bessel-filter-schema.json
import * as z from 'zod';

export interface Bessel_filterInput {
  order: number;
  cutoffFrequency: number;
  samplingFrequency: number;
  frequencyPoint: number;
  dataConfidence?: number;
}

export const Bessel_filterInputSchema = z.object({
  order: z.number().default(2),
  cutoffFrequency: z.number().default(1000),
  samplingFrequency: z.number().default(10000),
  frequencyPoint: z.number().default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bessel_filterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.frequencyPoint / input.cutoffFrequency; results["normalizedFrequency"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalizedFrequency"] = 0; }
  try { const v = input.order === 1 ? 1 + (asFormulaNumber(results["normalizedFrequency"])) : input.order === 2 ? 3 + 3*(asFormulaNumber(results["normalizedFrequency"])) + (asFormulaNumber(results["normalizedFrequency"]))**2 : input.order === 3 ? 15 + 15*(asFormulaNumber(results["normalizedFrequency"])) + 6*(asFormulaNumber(results["normalizedFrequency"]))**2 + (asFormulaNumber(results["normalizedFrequency"]))**3 : 105 + 105*(asFormulaNumber(results["normalizedFrequency"])) + 45*(asFormulaNumber(results["normalizedFrequency"]))**2 + 10*(asFormulaNumber(results["normalizedFrequency"]))**3 + (asFormulaNumber(results["normalizedFrequency"]))**4; results["besselPolynomial"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["besselPolynomial"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBessel_filter(input: Bessel_filterInput): Bessel_filterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["besselPolynomial"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Bessel_filterOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
