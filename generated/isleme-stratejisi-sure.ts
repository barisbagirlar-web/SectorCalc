// Auto-generated from isleme-stratejisi-sure-schema.json
import * as z from 'zod';

export interface Isleme_stratejisi_sureInput {
  V_c: number;
  a_p: number;
  SpecEnergy: number;
  C: number;
  n: number;
  m: number;
  Mach: number;
  Change: number;
  Tool: number;
  ChangeTime: number;
  ToolCost: number;
  MachRate: number;
  NoseRad: number;
  MaxPower: number;
  Tol: number;
  dataConfidence?: number;
}

export const Isleme_stratejisi_sureInputSchema = z.object({
  V_c: z.number().min(0).default(0),
  a_p: z.number().min(0).default(0),
  SpecEnergy: z.number().min(0).default(0),
  C: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  m: z.number().min(0).default(0),
  Mach: z.number().min(0).default(0),
  Change: z.number().min(0).default(0),
  Tool: z.number().min(0).default(0),
  ChangeTime: z.number().min(0).default(0),
  ToolCost: z.number().min(0).default(0),
  MachRate: z.number().min(0).default(0),
  NoseRad: z.number().min(0).default(0),
  MaxPower: z.number().min(0).default(0),
  Tol: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Isleme_stratejisi_sureInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["MRR"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["MRR"])) * input.SpecEnergy; results["Power"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Power"] = Number.NaN; }
  results["ToolLife"] = Number.NaN;
  try { const v = Math.min(input.Mach + input.Change + input.Tool); results["Cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost"] = Number.NaN; }
  try { const v = (input.C / ((toNumericFormulaValue(results["T_opt"])))^input.n)^(1/input.n); results["Opt_Vc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Opt_Vc"] = Number.NaN; }
  try { const v = ((1/input.n - 1) * (input.ChangeTime + input.ToolCost/input.MachRate)); results["T_opt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T_opt"] = Number.NaN; }
  results["Ra"] = Number.NaN;
  results["Check"] = Number.NaN;
  return results;
}


export function calculateIsleme_stratejisi_sure(input: Isleme_stratejisi_sureInput): Isleme_stratejisi_sureOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Check"]);
  const breakdown = {
    MRR: toNumericFormulaValue(values["MRR"]),
    Power: toNumericFormulaValue(values["Power"]),
    ToolLife: toNumericFormulaValue(values["ToolLife"]),
    Cost: toNumericFormulaValue(values["Cost"]),
    Opt_Vc: toNumericFormulaValue(values["Opt_Vc"]),
    T_opt: toNumericFormulaValue(values["T_opt"]),
    Ra: toNumericFormulaValue(values["Ra"]),
    Check: toNumericFormulaValue(values["Check"])
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


export interface Isleme_stratejisi_sureOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { MRR: number; Power: number; ToolLife: number; Cost: number; Opt_Vc: number; T_opt: number; Ra: number; Check: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Isleme_stratejisi_sureOutputMeta = {
  primaryKey: "Check",
  unit: "USD",
  breakdownKeys: ["MRR","Power","ToolLife","Cost","Opt_Vc","T_opt","Ra","Check"],
} as const;

