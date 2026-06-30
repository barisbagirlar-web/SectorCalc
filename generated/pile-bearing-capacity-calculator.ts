// Auto-generated from pile-bearing-capacity-calculator-schema.json
import * as z from 'zod';

export interface Pile_bearing_capacity_calculatorInput {
  dataConfidence?: number;
  cap: number;
  boy: number;
  kohezyon: number;
  suratme: number;
}

export const Pile_bearing_capacity_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  cap: z.number().min(0).default(0.6),
  boy: z.number().min(0).default(15),
  kohezyon: z.number().min(0).default(100),
  suratme: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pile_bearing_capacity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.PI * Math.pow(input["cap"] / 2, 2)) * (9 * input["kohezyon"]); results["ucDayanimi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ucDayanimi"] = Number.NaN; }
  try { const v = Math.PI * input["cap"] * input["boy"] * input["suratme"]; results["yuzeySuratmesi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yuzeySuratmesi"] = Number.NaN; }
  try { const v = ((Math.PI * Math.pow(input["cap"] / 2, 2)) * (9 * input["kohezyon"])) + (Math.PI * input["cap"] * input["boy"] * input["suratme"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePile_bearing_capacity_calculator(input: Pile_bearing_capacity_calculatorInput): Pile_bearing_capacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "kN",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Pile_bearing_capacity_calculatorOutput {
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

export const Pile_bearing_capacity_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kN",
  breakdownKeys: ["ucDayanimi","yuzeySuratmesi"],
} as const;
