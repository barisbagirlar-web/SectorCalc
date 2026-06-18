// @ts-nocheck
// Auto-generated from pediatric-dose-calculator-schema.json
import * as z from 'zod';

export interface Pediatric_dose_calculatorInput {
  adultDose: number;
  childWeight: number;
  childAge: number;
  maxDosePerKg: number;
  concentration: number;
}

export const Pediatric_dose_calculatorInputSchema = z.object({
  adultDose: z.number().default(500),
  childWeight: z.number().default(10),
  childAge: z.number().default(5),
  maxDosePerKg: z.number().default(80),
  concentration: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pediatric_dose_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.childAge / (input.childAge + 12)) * input.adultDose; results["youngDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["youngDose"] = 0; }
  try { const v = (asFormulaNumber(results["youngDose"])) / input.concentration; results["volumeYoung"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumeYoung"] = 0; }
  try { const v = input.maxDosePerKg * input.childWeight; results["maxAllowedDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxAllowedDose"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePediatric_dose_calculator(input: Pediatric_dose_calculatorInput): Pediatric_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["youngDose"]);
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


export interface Pediatric_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
