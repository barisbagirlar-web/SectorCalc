// Auto-generated from ship-draft-calculator-schema.json
import * as z from 'zod';

export interface Ship_draft_calculatorInput {
  deplasman: number;
  suYogunlugu: number;
  boy: number;
  en: number;
  blokKatsayi: number;
  dataConfidence?: number;
}

export const Ship_draft_calculatorInputSchema = z.object({
  deplasman: z.number().min(0).default(5000),
  suYogunlugu: z.number().min(0).default(1.025),
  boy: z.number().min(0).default(100),
  en: z.number().min(0).default(18),
  blokKatsayi: z.number().min(0).default(0.7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ship_draft_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deplasman / Math.max(0.0001, (input.suYogunlugu * input.boy * input.en * input.blokKatsayi)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateShip_draft_calculator(input: Ship_draft_calculatorInput): Ship_draft_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ship_draft_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ship_draft_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

