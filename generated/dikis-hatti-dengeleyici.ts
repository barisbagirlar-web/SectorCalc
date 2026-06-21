// Auto-generated from dikis-hatti-dengeleyici-schema.json
import * as z from 'zod';

export interface Dikis_hatti_dengeleyiciInput {
  AvailableTime: number;
  Demand: number;
  SMV: number;
  MaxCycle: number;
  Cycle_i: number;
  Bottleneck: number;
  Takt: number;
  dataConfidence?: number;
}

export const Dikis_hatti_dengeleyiciInputSchema = z.object({
  AvailableTime: z.number().min(0).default(0),
  Demand: z.number().min(0).default(0),
  SMV: z.number().min(0).default(0),
  MaxCycle: z.number().min(0).default(0),
  Cycle_i: z.number().min(0).default(0),
  Bottleneck: z.number().min(0).default(0),
  Takt: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dikis_hatti_dengeleyiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.AvailableTime / input.Demand; results["TaktTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TaktTime"] = Number.NaN; }
  results["CycleTotal"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["CycleTotal"])) / (toNumericFormulaValue(results["TaktTime"])); results["TheoOperators"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TheoOperators"] = Number.NaN; }
  try { const v = Math.ceil((toNumericFormulaValue(results["TheoOperators"]))); results["ActOperators"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActOperators"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["CycleTotal"])) / ((toNumericFormulaValue(results["ActOperators"])) * (toNumericFormulaValue(results["TaktTime"])))) * 100; results["LineEff"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LineEff"] = Number.NaN; }
  try { const v = 100 - (toNumericFormulaValue(results["LineEff"])); results["BalanceDelay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BalanceDelay"] = Number.NaN; }
  results["Smoothness"] = Number.NaN;
  try { const v = (input.Bottleneck - input.Takt) * input.Demand; results["WIP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WIP"] = Number.NaN; }
  return results;
}


export function calculateDikis_hatti_dengeleyici(input: Dikis_hatti_dengeleyiciInput): Dikis_hatti_dengeleyiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["WIP"]);
  const breakdown = {
    TaktTime: toNumericFormulaValue(values["TaktTime"]),
    CycleTotal: toNumericFormulaValue(values["CycleTotal"]),
    TheoOperators: toNumericFormulaValue(values["TheoOperators"]),
    ActOperators: toNumericFormulaValue(values["ActOperators"]),
    LineEff: toNumericFormulaValue(values["LineEff"]),
    BalanceDelay: toNumericFormulaValue(values["BalanceDelay"]),
    Smoothness: toNumericFormulaValue(values["Smoothness"]),
    WIP: toNumericFormulaValue(values["WIP"])
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


export interface Dikis_hatti_dengeleyiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TaktTime: number; CycleTotal: number; TheoOperators: number; ActOperators: number; LineEff: number; BalanceDelay: number; Smoothness: number; WIP: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dikis_hatti_dengeleyiciOutputMeta = {
  primaryKey: "WIP",
  unit: "USD",
  breakdownKeys: ["TaktTime","CycleTotal","TheoOperators","ActOperators","LineEff","BalanceDelay","Smoothness","WIP"],
} as const;

