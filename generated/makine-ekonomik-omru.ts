// Auto-generated from makine-ekonomik-omru-schema.json
import * as z from 'zod';

export interface Makine_ekonomik_omruInput {
  InitialCost: number;
  SalvageValue: number;
  A: number;
  P: number;
  i: number;
  n: number;
  OpCost_t: number;
  F: number;
  t: number;
  CurrentMarketValue: number;
  OpCost_Defender: number;
  EUAC_NewMachine: number;
  Replace: number;
  Keep: number;
  dataConfidence?: number;
}

export const Makine_ekonomik_omruInputSchema = z.object({
  InitialCost: z.number().min(0).default(0),
  SalvageValue: z.number().min(0).default(0),
  A: z.number().min(0).default(0),
  P: z.number().min(0).default(0),
  i: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  OpCost_t: z.number().min(0).default(0),
  F: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
  CurrentMarketValue: z.number().min(0).default(0),
  OpCost_Defender: z.number().min(0).default(0),
  EUAC_NewMachine: z.number().min(0).default(0),
  Replace: z.number().min(0).default(0),
  Keep: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Makine_ekonomik_omruInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.InitialCost - input.SalvageValue) * (input.A/input.P, input.i, input.n) + input.SalvageValue * input.i; results["EUAC_Capital"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EUAC_Capital"] = Number.NaN; }
  results["EUAC_Operating"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["EUAC_Capital"])) + (toNumericFormulaValue(results["EUAC_Operating"])); results["TotalEUAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalEUAC"] = Number.NaN; }
  try { const v = 0.0; results["EconomicLife"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EconomicLife"] = Number.NaN; }
  try { const v = input.CurrentMarketValue * (input.A/input.P, input.i, input.n) + input.OpCost_Defender; results["Defender_EUAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Defender_EUAC"] = Number.NaN; }
  try { const v = input.EUAC_NewMachine; results["Challenger_EUAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Challenger_EUAC"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["Defender_EUAC"])) > (toNumericFormulaValue(results["Challenger_EUAC"]))) ? ("input.Replace") : ("input.Keep")); results["ReplacementDecision"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ReplacementDecision"] = Number.NaN; }
  return results;
}


export function calculateMakine_ekonomik_omru(input: Makine_ekonomik_omruInput): Makine_ekonomik_omruOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ReplacementDecision"]);
  const breakdown = {
    EUAC_Capital: toNumericFormulaValue(values["EUAC_Capital"]),
    EUAC_Operating: toNumericFormulaValue(values["EUAC_Operating"]),
    TotalEUAC: toNumericFormulaValue(values["TotalEUAC"]),
    EconomicLife: toNumericFormulaValue(values["EconomicLife"]),
    Defender_EUAC: toNumericFormulaValue(values["Defender_EUAC"]),
    Challenger_EUAC: toNumericFormulaValue(values["Challenger_EUAC"]),
    ReplacementDecision: toNumericFormulaValue(values["ReplacementDecision"])
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


export interface Makine_ekonomik_omruOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { EUAC_Capital: number; EUAC_Operating: number; TotalEUAC: number; EconomicLife: number; Defender_EUAC: number; Challenger_EUAC: number; ReplacementDecision: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Makine_ekonomik_omruOutputMeta = {
  primaryKey: "ReplacementDecision",
  unit: "USD",
  breakdownKeys: ["EUAC_Capital","EUAC_Operating","TotalEUAC","EconomicLife","Defender_EUAC","Challenger_EUAC","ReplacementDecision"],
} as const;

