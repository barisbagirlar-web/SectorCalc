// Auto-generated from convertible-note-calculator-schema.json
import * as z from 'zod';

export interface Convertible_note_calculatorInput {
  dataConfidence?: number;
  yatirim: number;
  degerleme: number;
  iskonto: number;
  faiz: number;
}

export const Convertible_note_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yatirim: z.number().min(0).default(500000),
  degerleme: z.number().min(0).default(5000000),
  iskonto: z.number().min(0).max(100).default(20),
  faiz: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Convertible_note_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["degerleme"] * (1 - input["iskonto"] / 100); results["donusumFiyati"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["donusumFiyati"] = Number.NaN; }
  try { const v = (input["yatirim"] * (1 + input["faiz"] / 100)) / Math.max(0.0001, (input["degerleme"] * (1 - input["iskonto"] / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateConvertible_note_calculator(input: Convertible_note_calculatorInput): Convertible_note_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "shares",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Convertible_note_calculatorOutput {
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

export const Convertible_note_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "shares",
  breakdownKeys: ["donusumFiyati"],
} as const;
