// Auto-generated from enflasyon-eskalasyon-schema.json
import * as z from 'zod';

export interface Enflasyon_eskalasyonInput {
  Infl_Mat: number;
  Years: number;
  Infl_Lab: number;
  BaseMat: number;
  BaseLab: number;
  Nominal: number;
  Infl: number;
  Cash: number;
  Esc: number;
  Nom: number;
  t: number;
  Real: number;
  ConfFactor: number;
  dataConfidence?: number;
}

export const Enflasyon_eskalasyonInputSchema = z.object({
  Infl_Mat: z.number().min(0).default(0),
  Years: z.number().min(0).default(0),
  Infl_Lab: z.number().min(0).default(0),
  BaseMat: z.number().min(0).default(0),
  BaseLab: z.number().min(0).default(0),
  Nominal: z.number().min(0).default(0),
  Infl: z.number().min(0).default(0),
  Cash: z.number().min(0).default(0),
  Esc: z.number().min(0).default(0),
  Nom: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
  Real: z.number().min(0).default(0),
  ConfFactor: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Enflasyon_eskalasyonInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 + input.Infl_Mat)^input.Years; results["Esc_Mat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Esc_Mat"] = Number.NaN; }
  try { const v = (1 + input.Infl_Lab)^input.Years; results["Esc_Lab"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Esc_Lab"] = Number.NaN; }
  try { const v = input.BaseMat * (toNumericFormulaValue(results["Esc_Mat"])) + input.BaseLab * (toNumericFormulaValue(results["Esc_Lab"])); results["BaseAdj"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BaseAdj"] = Number.NaN; }
  try { const v = ((1 + input.Nominal) / (1 + input.Infl)) - 1; results["RealDisc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RealDisc"] = Number.NaN; }
  results["NPV_Nom"] = Number.NaN;
  results["NPV_Real"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["BaseAdj"])) * input.ConfFactor; results["Contingency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Contingency"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["BaseAdj"])) + (toNumericFormulaValue(results["Contingency"])); results["Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Total"] = Number.NaN; }
  return results;
}


export function calculateEnflasyon_eskalasyon(input: Enflasyon_eskalasyonInput): Enflasyon_eskalasyonOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Total"]);
  const breakdown = {
    Esc_Mat: toNumericFormulaValue(values["Esc_Mat"]),
    Esc_Lab: toNumericFormulaValue(values["Esc_Lab"]),
    BaseAdj: toNumericFormulaValue(values["BaseAdj"]),
    RealDisc: toNumericFormulaValue(values["RealDisc"]),
    NPV_Nom: toNumericFormulaValue(values["NPV_Nom"]),
    NPV_Real: toNumericFormulaValue(values["NPV_Real"]),
    Contingency: toNumericFormulaValue(values["Contingency"]),
    Total: toNumericFormulaValue(values["Total"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Enflasyon_eskalasyonOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Esc_Mat: number; Esc_Lab: number; BaseAdj: number; RealDisc: number; NPV_Nom: number; NPV_Real: number; Contingency: number; Total: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Enflasyon_eskalasyonOutputMeta = {
  primaryKey: "Total",
  unit: "USD",
  breakdownKeys: ["Esc_Mat","Esc_Lab","BaseAdj","RealDisc","NPV_Nom","NPV_Real","Contingency","Total"],
} as const;

