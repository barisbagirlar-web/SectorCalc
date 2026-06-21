// Auto-generated from wallpaper-roll-calculator-schema.json
import * as z from 'zod';

export interface Wallpaper_roll_calculatorInput {
  alan: number;
  ruloEn: number;
  ruloBoy: number;
  desenTekrari: number;
  dataConfidence?: number;
}

export const Wallpaper_roll_calculatorInputSchema = z.object({
  alan: z.number().min(0).default(50),
  ruloEn: z.number().min(0).default(0.53),
  ruloBoy: z.number().min(0).default(10),
  desenTekrari: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wallpaper_roll_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.alan / Math.max(0.0001, (input.ruloEn * input.ruloBoy * (1 - input.desenTekrari / Math.max(0.0001, input.ruloBoy))))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateWallpaper_roll_calculator(input: Wallpaper_roll_calculatorInput): Wallpaper_roll_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "rolls",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Wallpaper_roll_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Wallpaper_roll_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "rolls",
  breakdownKeys: ["sonuc"],
} as const;

