// Auto-generated from pediatric-dose-calculator-schema.json
import * as z from 'zod';

export interface Pediatric_dose_calculatorInput {
  adultDose: number;
  childWeight: number;
  childAge: number;
  maxDosePerKg: number;
  concentration: number;
  dataConfidence?: number;
}

export const Pediatric_dose_calculatorInputSchema = z.object({
  adultDose: z.number().default(500),
  childWeight: z.number().default(10),
  childAge: z.number().default(5),
  maxDosePerKg: z.number().default(80),
  concentration: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pediatric_dose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.childAge / (input.childAge + 12)) * input.adultDose; results["youngDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["youngDose"] = Number.NaN; }
  try { const v = input.maxDosePerKg * input.childWeight; results["maxAllowedDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxAllowedDose"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["youngDose"])) / input.concentration; results["volumeYoung"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeYoung"] = Number.NaN; }
  return results;
}


export function calculatePediatric_dose_calculator(input: Pediatric_dose_calculatorInput): Pediatric_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["youngDose"]);
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


export interface Pediatric_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
