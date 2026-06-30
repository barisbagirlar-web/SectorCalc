// Auto-generated from brrrr-investment-calculator-schema.json
import * as z from 'zod';

export interface Brrrr_investment_calculatorInput {
  dataConfidence?: number;
  alim: number;
  rehab: number;
  deger: number;
  kredi: number;
  kira: number;
}

export const Brrrr_investment_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alim: z.number().min(0).default(500000),
  rehab: z.number().min(0).default(150000),
  deger: z.number().min(0).default(800000),
  kredi: z.number().min(0).default(600000),
  kira: z.number().min(0).default(8000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Brrrr_investment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["alim"] + input["rehab"] - input["kredi"]; results["zorunluSermaye"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zorunluSermaye"] = Number.NaN; }
  try { const v = ((input["kira"] * 12) / Math.max(1, (input["alim"] + input["rehab"] - input["kredi"]))) * 100; results["coc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["coc"] = Number.NaN; }
  try { const v = ((input["deger"] - (input["alim"] + input["rehab"])) / Math.max(1, (input["alim"] + input["rehab"]))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBrrrr_investment_calculator(input: Brrrr_investment_calculatorInput): Brrrr_investment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "zorunluSermaye": toNumericFormulaValue(values["zorunluSermaye"]),
    "coc": toNumericFormulaValue(values["coc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Brrrr_investment_calculatorOutput {
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

export const Brrrr_investment_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["zorunluSermaye","coc"],
} as const;
