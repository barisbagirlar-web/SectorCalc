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

function evaluateAllFormulas(input: Pediatric_dose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round((input.childWeight / 68) * input.adultDose * 100) / 100; results["clarkDose"] = Number.isFinite(v) ? v : 0; } catch { results["clarkDose"] = 0; }
  try { const v = Math.round((input.childAge / (input.childAge + 12)) * input.adultDose * 100) / 100; results["youngDose"] = Number.isFinite(v) ? v : 0; } catch { results["youngDose"] = 0; }
  try { const v = input.maxDosePerKg * input.childWeight; results["maxAllowedDose"] = Number.isFinite(v) ? v : 0; } catch { results["maxAllowedDose"] = 0; }
  try { const v = Math.round((results["clarkDose"] ?? 0) / input.concentration * 100) / 100; results["volumeClarke"] = Number.isFinite(v) ? v : 0; } catch { results["volumeClarke"] = 0; }
  try { const v = Math.round((results["youngDose"] ?? 0) / input.concentration * 100) / 100; results["volumeYoung"] = Number.isFinite(v) ? v : 0; } catch { results["volumeYoung"] = 0; }
  try { const v = (results["clarkDose"] ?? 0) <= (results["maxAllowedDose"] ?? 0); results["isClarkeSafe"] = Number.isFinite(v) ? v : 0; } catch { results["isClarkeSafe"] = 0; }
  try { const v = (results["youngDose"] ?? 0) <= (results["maxAllowedDose"] ?? 0); results["isYoungSafe"] = Number.isFinite(v) ? v : 0; } catch { results["isYoungSafe"] = 0; }
  results["__youngDose__mg____volumeYoung__mL___G_v"] = 0;
  results["__maxAllowedDose__mg"] = 0;
  results["result"] = 0;
  return results;
}


export function calculatePediatric_dose_calculator(input: Pediatric_dose_calculatorInput): Pediatric_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Pediatric_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
