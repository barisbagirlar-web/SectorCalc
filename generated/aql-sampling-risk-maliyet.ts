// Auto-generated from aql-sampling-risk-maliyet-schema.json
import * as z from 'zod';

export interface Aql_sampling_risk_maliyetInput {
  LotSize: number;
  InspectionLevel: number;
  AQL: number;
  p_AQL: number;
  p_LTPD: number;
  Pa: number;
  N: number;
  p: number;
  DetectionRate: number;
  CostPerDefect: number;
  dataConfidence?: number;
}

export const Aql_sampling_risk_maliyetInputSchema = z.object({
  LotSize: z.number().min(0).default(0),
  InspectionLevel: z.number().min(0).default(0),
  AQL: z.number().min(0).default(0),
  p_AQL: z.number().min(0).default(0),
  p_LTPD: z.number().min(0).default(0),
  Pa: z.number().min(0).default(0),
  N: z.number().min(0).default(0),
  p: z.number().min(0).default(0),
  DetectionRate: z.number().min(0).default(0),
  CostPerDefect: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Aql_sampling_risk_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["CodeLetter"] = Number.NaN;
  results["n"] = Number.NaN;
  results["Ac"] = Number.NaN;
  results["Pa_producer"] = Number.NaN;
  try { const v = 1 - (toNumericFormulaValue(results["Pa_producer"])); results["Alpha"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Alpha"] = Number.NaN; }
  results["Pa_consumer"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["Pa_consumer"])); results["Beta"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Beta"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["n"])) + (1 - input.Pa) * (input.N - (toNumericFormulaValue(results["n"]))); results["ATI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ATI"] = Number.NaN; }
  try { const v = (input.N * input.p * (1 - input.Pa) * (1 - input.DetectionRate)) * input.CostPerDefect; results["TotalRiskCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalRiskCost"] = Number.NaN; }
  return results;
}


export function calculateAql_sampling_risk_maliyet(input: Aql_sampling_risk_maliyetInput): Aql_sampling_risk_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalRiskCost"]);
  const breakdown = {
    CodeLetter: toNumericFormulaValue(values["CodeLetter"]),
    n: toNumericFormulaValue(values["n"]),
    Ac: toNumericFormulaValue(values["Ac"]),
    Pa_producer: toNumericFormulaValue(values["Pa_producer"]),
    Alpha: toNumericFormulaValue(values["Alpha"]),
    Pa_consumer: toNumericFormulaValue(values["Pa_consumer"]),
    Beta: toNumericFormulaValue(values["Beta"]),
    ATI: toNumericFormulaValue(values["ATI"]),
    TotalRiskCost: toNumericFormulaValue(values["TotalRiskCost"])
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


export interface Aql_sampling_risk_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { CodeLetter: number; n: number; Ac: number; Pa_producer: number; Alpha: number; Pa_consumer: number; Beta: number; ATI: number; TotalRiskCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Aql_sampling_risk_maliyetOutputMeta = {
  primaryKey: "TotalRiskCost",
  unit: "USD",
  breakdownKeys: ["CodeLetter","n","Ac","Pa_producer","Alpha","Pa_consumer","Beta","ATI","TotalRiskCost"],
} as const;

