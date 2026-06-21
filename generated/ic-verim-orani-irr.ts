// Auto-generated from ic-verim-orani-irr-schema.json
import * as z from 'zod';

export interface Ic_verim_orani_irrInput {
  Cash_t: number;
  r: number;
  t: number;
  FV_Pos: number;
  PV_Neg: number;
  n: number;
  Year_Before: number;
  Unrecovered: number;
  Cash_Rec: number;
  PV_Future: number;
  InitInv: number;
  Delta_IRR: number;
  Delta_Var: number;
  dataConfidence?: number;
}

export const Ic_verim_orani_irrInputSchema = z.object({
  Cash_t: z.number().min(0).default(0),
  r: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
  FV_Pos: z.number().min(0).default(0),
  PV_Neg: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  Year_Before: z.number().min(0).default(0),
  Unrecovered: z.number().min(0).default(0),
  Cash_Rec: z.number().min(0).default(0),
  PV_Future: z.number().min(0).default(0),
  InitInv: z.number().min(0).default(0),
  Delta_IRR: z.number().min(0).default(0),
  Delta_Var: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ic_verim_orani_irrInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["NPV"] = Number.NaN;
  try { const v = 0.0; results["IRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["IRR"] = Number.NaN; }
  try { const v = (input.FV_Pos / input.PV_Neg)^(1/input.n) - 1; results["MIRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MIRR"] = Number.NaN; }
  try { const v = input.Year_Before + (input.Unrecovered / input.Cash_Rec); results["Payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Payback"] = Number.NaN; }
  try { const v = input.PV_Future / input.InitInv; results["PI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PI"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["NPV"])) * (input.r * (1 + input.r)^input.n) / ((1 + input.r)^input.n - 1); results["Annuity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Annuity"] = Number.NaN; }
  try { const v = input.Delta_IRR / input.Delta_Var; results["Sens"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Sens"] = Number.NaN; }
  return results;
}


export function calculateIc_verim_orani_irr(input: Ic_verim_orani_irrInput): Ic_verim_orani_irrOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Sens"]);
  const breakdown = {
    NPV: toNumericFormulaValue(values["NPV"]),
    IRR: toNumericFormulaValue(values["IRR"]),
    MIRR: toNumericFormulaValue(values["MIRR"]),
    Payback: toNumericFormulaValue(values["Payback"]),
    PI: toNumericFormulaValue(values["PI"]),
    Annuity: toNumericFormulaValue(values["Annuity"]),
    Sens: toNumericFormulaValue(values["Sens"])
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


export interface Ic_verim_orani_irrOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { NPV: number; IRR: number; MIRR: number; Payback: number; PI: number; Annuity: number; Sens: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ic_verim_orani_irrOutputMeta = {
  primaryKey: "Sens",
  unit: "USD",
  breakdownKeys: ["NPV","IRR","MIRR","Payback","PI","Annuity","Sens"],
} as const;

