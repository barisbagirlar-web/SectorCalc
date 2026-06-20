// Auto-generated from cycling-ftp-calculator-schema.json
import * as z from 'zod';

export interface Cycling_ftp_calculatorInput {
  averagePower: number;
  factor: number;
  bodyWeight: number;
  testDuration: number;
  age: number;
  temperature: number;
  dataConfidence?: number;
}

export const Cycling_ftp_calculatorInputSchema = z.object({
  averagePower: z.number().default(250),
  factor: z.number().default(0.95),
  bodyWeight: z.number().default(70),
  testDuration: z.number().default(20),
  age: z.number().default(30),
  temperature: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cycling_ftp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averagePower * input.factor; results["ftp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ftp"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ftp"])) / input.bodyWeight; results["powerToWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerToWeight"] = Number.NaN; }
  return results;
}


export function calculateCycling_ftp_calculator(input: Cycling_ftp_calculatorInput): Cycling_ftp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ftp"]);
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


export interface Cycling_ftp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
