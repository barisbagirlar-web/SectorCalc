// Auto-generated from item-difficulty-discrimination-calculator-schema.json
import * as z from 'zod';

export interface Item_difficulty_discrimination_calculatorInput {
  dataConfidence?: number;
  dogruCevap: number;
  toplamOgrenci: number;
  ustGrupDogru: number;
  altGrupDogru: number;
  grupBoyutu: number;
}

export const Item_difficulty_discrimination_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  dogruCevap: z.number().min(0).default(40),
  toplamOgrenci: z.number().min(0).default(100),
  ustGrupDogru: z.number().min(0).default(25),
  altGrupDogru: z.number().min(0).default(5),
  grupBoyutu: z.number().min(0).default(27),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Item_difficulty_discrimination_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["dogruCevap"] / Math.max(1, input["toplamOgrenci"]); results["p"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["p"] = Number.NaN; }
  try { const v = (input["ustGrupDogru"] - input["altGrupDogru"]) / Math.max(1, input["grupBoyutu"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateItem_difficulty_discrimination_calculator(input: Item_difficulty_discrimination_calculatorInput): Item_difficulty_discrimination_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "p": toNumericFormulaValue(values["p"])
  };
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
    unit: "r-value",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Item_difficulty_discrimination_calculatorOutput {
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

export const Item_difficulty_discrimination_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "r-value",
  breakdownKeys: ["p"],
} as const;
