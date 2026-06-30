// Auto-generated from building-shadow-duration-calculator-schema.json
import * as z from 'zod';

export interface Building_shadow_duration_calculatorInput {
  dataConfidence?: number;
  enlem: number;
  gunSayisi: number;
  engelYukseklik: number;
  mesafe: number;
}

export const Building_shadow_duration_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  enlem: z.number().min(0).default(41),
  gunSayisi: z.number().min(1).max(365).default(172),
  engelYukseklik: z.number().min(0).default(20),
  mesafe: z.number().min(0).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Building_shadow_duration_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.atan(input["engelYukseklik"] / Math.max(0.0001, input["mesafe"])); results["golgeAcisi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["golgeAcisi"] = Number.NaN; }
  try { const v = (Math.atan(input["engelYukseklik"] / Math.max(0.0001, input["mesafe"])) * 180 / Math.PI) / 15 * 2; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBuilding_shadow_duration_calculator(input: Building_shadow_duration_calculatorInput): Building_shadow_duration_calculatorOutput {
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
    unit: "hours",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Building_shadow_duration_calculatorOutput {
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

export const Building_shadow_duration_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "hours",
  breakdownKeys: ["golgeAcisi"],
} as const;
