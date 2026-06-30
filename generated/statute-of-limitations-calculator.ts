// Auto-generated from statute-of-limitations-calculator-schema.json
import * as z from 'zod';

export interface Statute_of_limitations_calculatorInput {
  dataConfidence?: number;
  olayTarihi: number;
  yasalSure: number;
  kesintiDurumu: number;
}

export const Statute_of_limitations_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  olayTarihi: z.number().min(0).default(2020),
  yasalSure: z.number().min(0).default(10),
  kesintiDurumu: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Statute_of_limitations_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["kesintiDurumu"] === 1 ? input["olayTarihi"] : input["olayTarihi"] + input["yasalSure"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateStatute_of_limitations_calculator(input: Statute_of_limitations_calculatorInput): Statute_of_limitations_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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
    unit: "year",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Statute_of_limitations_calculatorOutput {
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

export const Statute_of_limitations_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "year",
  breakdownKeys: [],
} as const;
