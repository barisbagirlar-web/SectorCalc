// Auto-generated from civate-tork-schema.json
import * as z from 'zod';

export interface Civate_torkInput {
  K: number;
  D: number;
  Preload: number;
  ProofStrength: number;
  d: number;
  p: number;
  YieldStrength: number;
  FAIL: number;
  dataConfidence?: number;
}

export const Civate_torkInputSchema = z.object({
  K: z.number().min(0).default(0),
  D: z.number().min(0).default(0),
  Preload: z.number().min(0).default(0),
  ProofStrength: z.number().min(0).default(0),
  d: z.number().min(0).default(0),
  p: z.number().min(0).default(0),
  YieldStrength: z.number().min(0).default(0),
  FAIL: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Civate_torkInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.K * input.D * (toNumericFormulaValue(results["F"])); results["T"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Sigma_p"])) * (toNumericFormulaValue(results["A_t"])); results["F"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["F"] = Number.NaN; }
  try { const v = 0.7 * input.ProofStrength; results["Sigma_p"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Sigma_p"] = Number.NaN; }
  try { const v = (Math.PI / 4) * (((toNumericFormulaValue(results["d2"])) + (toNumericFormulaValue(results["d3"]))) / 2)**2; results["A_t"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["A_t"] = Number.NaN; }
  try { const v = input.d - 0.649519 * input.p; results["d2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d2"] = Number.NaN; }
  try { const v = input.d - 1.226869 * input.p; results["d3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d3"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["Sigma_p"])) > input.YieldStrength) ? ("input.FAIL") : ("PASS")); results["YieldCheck"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["YieldCheck"] = Number.NaN; }
  return results;
}


export function calculateCivate_tork(input: Civate_torkInput): Civate_torkOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["YieldCheck"]);
  const breakdown = {
    T: toNumericFormulaValue(values["T"]),
    F: toNumericFormulaValue(values["F"]),
    Sigma_p: toNumericFormulaValue(values["Sigma_p"]),
    A_t: toNumericFormulaValue(values["A_t"]),
    d2: toNumericFormulaValue(values["d2"]),
    d3: toNumericFormulaValue(values["d3"]),
    YieldCheck: toNumericFormulaValue(values["YieldCheck"])
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


export interface Civate_torkOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { T: number; F: number; Sigma_p: number; A_t: number; d2: number; d3: number; YieldCheck: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Civate_torkOutputMeta = {
  primaryKey: "YieldCheck",
  unit: "USD",
  breakdownKeys: ["T","F","Sigma_p","A_t","d2","d3","YieldCheck"],
} as const;

