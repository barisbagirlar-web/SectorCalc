// @ts-nocheck
// Auto-generated from saps-ii-calculator-schema.json
import * as z from 'zod';

export interface Saps_ii_calculatorInput {
  age: number;
  heartRate: number;
  systolicBP: number;
  temperature: number;
  ventilation: number;
  paO2FiO2: number;
  urineOutput: number;
  serumUrea: number;
}

export const Saps_ii_calculatorInputSchema = z.object({
  age: z.number().default(60),
  heartRate: z.number().default(80),
  systolicBP: z.number().default(120),
  temperature: z.number().default(37),
  ventilation: z.number().default(0),
  paO2FiO2: z.number().default(0),
  urineOutput: z.number().default(1.5),
  serumUrea: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Saps_ii_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.age < 40) ? 0 : (input.age < 60) ? 7 : (input.age < 70) ? 12 : (input.age < 75) ? 15 : (input.age < 80) ? 16 : 18; results["agePoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["agePoints"] = 0; }
  try { const v = (input.heartRate < 40) ? 11 : (input.heartRate < 70) ? 2 : (input.heartRate < 120) ? 0 : (input.heartRate < 160) ? 4 : 7; results["hrPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hrPoints"] = 0; }
  try { const v = (input.systolicBP < 70) ? 13 : (input.systolicBP < 100) ? 5 : (input.systolicBP < 200) ? 0 : 2; results["sysBPPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sysBPPoints"] = 0; }
  try { const v = (input.temperature >= 39) ? 3 : 0; results["tempPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tempPoints"] = 0; }
  try { const v = (input.ventilation === 1) ? ((input.paO2FiO2 < 100) ? 11 : (input.paO2FiO2 < 200) ? 9 : 6) : 0; results["ventPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ventPoints"] = 0; }
  try { const v = (input.urineOutput < 0.5) ? 11 : (input.urineOutput < 1) ? 4 : 0; results["urinePoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["urinePoints"] = 0; }
  try { const v = (input.serumUrea < 10) ? 0 : (input.serumUrea < 30) ? 6 : 10; results["ureaPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ureaPoints"] = 0; }
  try { const v = (asFormulaNumber(results["agePoints"])) + (asFormulaNumber(results["hrPoints"])) + (asFormulaNumber(results["sysBPPoints"])) + (asFormulaNumber(results["tempPoints"])) + (asFormulaNumber(results["ventPoints"])) + (asFormulaNumber(results["urinePoints"])) + (asFormulaNumber(results["ureaPoints"])); results["saps2Score"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["saps2Score"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSaps_ii_calculator(input: Saps_ii_calculatorInput): Saps_ii_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["saps2Score"]);
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


export interface Saps_ii_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
