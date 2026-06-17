// @ts-nocheck
// Auto-generated from cycling-tss-calculator-schema.json
import * as z from 'zod';

export interface Cycling_tss_calculatorInput {
  durationMinutes: number;
  normalizedPower: number;
  ftp: number;
  averagePower: number;
}

export const Cycling_tss_calculatorInputSchema = z.object({
  durationMinutes: z.number().default(60),
  normalizedPower: z.number().default(200),
  ftp: z.number().default(250),
  averagePower: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cycling_tss_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.durationMinutes * 60 * input.normalizedPower * (input.normalizedPower / input.ftp)) / (input.ftp * 3600) * 100; results["tss"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tss"] = 0; }
  try { const v = input.normalizedPower / input.ftp; results["intensityFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["intensityFactor"] = 0; }
  try { const v = input.averagePower > 0 ? input.normalizedPower / input.averagePower : 0; results["variabilityIndex"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["variabilityIndex"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCycling_tss_calculator(input: Cycling_tss_calculatorInput): Cycling_tss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tss"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Cycling_tss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
