// Auto-generated from student-loan-refinance-calculator-schema.json
import * as z from 'zod';

export interface Student_loan_refinance_calculatorInput {
  dataConfidence?: number;
  eskiBakiye: number;
  eskiFaiz: number;
  yeniFaiz: number;
  vade: number;
}

export const Student_loan_refinance_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  eskiBakiye: z.number().min(0).default(100000),
  eskiFaiz: z.number().min(0).default(12),
  yeniFaiz: z.number().min(0).default(8),
  vade: z.number().min(1).default(48),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Student_loan_refinance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["eskiFaiz"] === 0 ? input["eskiBakiye"] / Math.max(1, input["vade"]) : input["eskiBakiye"] * ((input["eskiFaiz"] / 1200) * Math.pow(1 + input["eskiFaiz"] / 1200, input["vade"])) / (Math.pow(1 + input["eskiFaiz"] / 1200, input["vade"]) - 1); results["eskiTaksit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eskiTaksit"] = Number.NaN; }
  try { const v = input["yeniFaiz"] === 0 ? input["eskiBakiye"] / Math.max(1, input["vade"]) : input["eskiBakiye"] * ((input["yeniFaiz"] / 1200) * Math.pow(1 + input["yeniFaiz"] / 1200, input["vade"])) / (Math.pow(1 + input["yeniFaiz"] / 1200, input["vade"]) - 1); results["yeniTaksit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yeniTaksit"] = Number.NaN; }
  try { const v = ((input["eskiFaiz"] === 0 ? input["eskiBakiye"] / Math.max(1, input["vade"]) : input["eskiBakiye"] * ((input["eskiFaiz"] / 1200) * Math.pow(1 + input["eskiFaiz"] / 1200, input["vade"])) / (Math.pow(1 + input["eskiFaiz"] / 1200, input["vade"]) - 1)) - (input["yeniFaiz"] === 0 ? input["eskiBakiye"] / Math.max(1, input["vade"]) : input["eskiBakiye"] * ((input["yeniFaiz"] / 1200) * Math.pow(1 + input["yeniFaiz"] / 1200, input["vade"])) / (Math.pow(1 + input["yeniFaiz"] / 1200, input["vade"]) - 1))) * input["vade"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateStudent_loan_refinance_calculator(input: Student_loan_refinance_calculatorInput): Student_loan_refinance_calculatorOutput {
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

export interface Student_loan_refinance_calculatorOutput {
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

export const Student_loan_refinance_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["eskiTaksit","yeniTaksit"],
} as const;
