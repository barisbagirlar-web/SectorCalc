// Auto-generated from boat-loan-calculator-schema.json
import * as z from 'zod';

export interface Boat_loan_calculatorInput {
  dataConfidence?: number;
  fiyat: number;
  pesin: number;
  faiz: number;
  vade: number;
}

export const Boat_loan_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  fiyat: z.number().min(0).default(1000000),
  pesin: z.number().min(0).default(200000),
  faiz: z.number().min(0).default(18),
  vade: z.number().min(1).default(84),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Boat_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["fiyat"] - input["pesin"]; results["krediNet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["krediNet"] = Number.NaN; }
  try { const v = (input["fiyat"] - input["pesin"]) * ((input["faiz"] / 1200) * Math.pow(1 + input["faiz"] / 1200, input["vade"])) / (Math.pow(1 + input["faiz"] / 1200, input["vade"]) - 1); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBoat_loan_calculator(input: Boat_loan_calculatorInput): Boat_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Boat_loan_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Boat_loan_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["krediNet"],
} as const;
