// Auto-generated from kesim-parameters-takim-omru-schema.json
import * as z from 'zod';

export interface Kesim_parameters_takim_omruInput {
  C: number;
  V_c: number;
  n: number;
  m: number;
  a_p: number;
  k: number;
  T1: number;
  T2: number;
  V1: number;
  V2: number;
  ToolCost: number;
  Edges: number;
  MachiningTime: number;
  ToolLife: number;
  ToolChangeTime: number;
  MachineRate: number;
  dataConfidence?: number;
}

export const Kesim_parameters_takim_omruInputSchema = z.object({
  C: z.number().min(0).default(0),
  V_c: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  m: z.number().min(0).default(0),
  a_p: z.number().min(0).default(0),
  k: z.number().min(0).default(0),
  T1: z.number().min(0).default(0),
  T2: z.number().min(0).default(0),
  V1: z.number().min(0).default(0),
  V2: z.number().min(0).default(0),
  ToolCost: z.number().min(0).default(0),
  Edges: z.number().min(0).default(0),
  MachiningTime: z.number().min(0).default(0),
  ToolLife: z.number().min(0).default(0),
  ToolChangeTime: z.number().min(0).default(0),
  MachineRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kesim_parameters_takim_omruInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["ToolLife_T"] = Number.NaN;
  try { const v = -Math.log(input.T1/input.T2) / Math.log(input.V1/input.V2); results["TaylorExponent_n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TaylorExponent_n"] = Number.NaN; }
  try { const v = (input.ToolCost / input.Edges) * (input.MachiningTime / input.ToolLife); results["CostPerPart_Tool"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerPart_Tool"] = Number.NaN; }
  try { const v = ((1/input.n - 1) * (input.ToolChangeTime + input.ToolCost/input.Edges / input.MachineRate)); results["OptimalToolLife_Cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimalToolLife_Cost"] = Number.NaN; }
  try { const v = input.C / ((toNumericFormulaValue(results["OptimalToolLife_Cost"]))^input.n); results["Optimal_Vc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Optimal_Vc"] = Number.NaN; }
  try { const v = 1 / (input.MachiningTime + (input.MachiningTime / input.ToolLife) * input.ToolChangeTime); results["ProductionRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProductionRate"] = Number.NaN; }
  return results;
}


export function calculateKesim_parameters_takim_omru(input: Kesim_parameters_takim_omruInput): Kesim_parameters_takim_omruOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ProductionRate"]);
  const breakdown = {
    ToolLife_T: toNumericFormulaValue(values["ToolLife_T"]),
    TaylorExponent_n: toNumericFormulaValue(values["TaylorExponent_n"]),
    CostPerPart_Tool: toNumericFormulaValue(values["CostPerPart_Tool"]),
    OptimalToolLife_Cost: toNumericFormulaValue(values["OptimalToolLife_Cost"]),
    Optimal_Vc: toNumericFormulaValue(values["Optimal_Vc"]),
    ProductionRate: toNumericFormulaValue(values["ProductionRate"])
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


export interface Kesim_parameters_takim_omruOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ToolLife_T: number; TaylorExponent_n: number; CostPerPart_Tool: number; OptimalToolLife_Cost: number; Optimal_Vc: number; ProductionRate: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kesim_parameters_takim_omruOutputMeta = {
  primaryKey: "ProductionRate",
  unit: "USD",
  breakdownKeys: ["ToolLife_T","TaylorExponent_n","CostPerPart_Tool","OptimalToolLife_Cost","Optimal_Vc","ProductionRate"],
} as const;

