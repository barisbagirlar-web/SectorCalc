// Auto-generated from drywall-sheet-calculator-schema.json
import * as z from 'zod';

export interface Drywall_sheet_calculatorInput {
  dataConfidence?: number;
  alan: number;
  levhaEn: number;
  levhaBoy: number;
  fire: number;
}

export const Drywall_sheet_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(80),
  levhaEn: z.number().min(0).default(1.2),
  levhaBoy: z.number().min(0).default(2.5),
  fire: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Drywall_sheet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil((input["alan"] * (1 + input["fire"] / 100)) / Math.max(0.0001, (input["levhaEn"] * input["levhaBoy"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDrywall_sheet_calculator(input: Drywall_sheet_calculatorInput): Drywall_sheet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "sheets",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Drywall_sheet_calculatorOutput {
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

export const Drywall_sheet_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "sheets",
  breakdownKeys: [],
} as const;
