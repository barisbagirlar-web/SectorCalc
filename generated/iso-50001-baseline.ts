// Auto-generated from iso-50001-baseline-schema.json
import * as z from 'zod';

export interface Iso_50001_baselineInput {
  Energy: number;
  Volume: number;
  Slope1: number;
  Prod: number;
  Slope2: number;
  DD: number;
  Actual: number;
  Predicted: number;
  DD_Curr: number;
  DD_Hist: number;
  R2: number;
  P: number;
  RedTarget: number;
  dataConfidence?: number;
}

export const Iso_50001_baselineInputSchema = z.object({
  Energy: z.number().min(0).default(0),
  Volume: z.number().min(0).default(0),
  Slope1: z.number().min(0).default(0),
  Prod: z.number().min(0).default(0),
  Slope2: z.number().min(0).default(0),
  DD: z.number().min(0).default(0),
  Actual: z.number().min(0).default(0),
  Predicted: z.number().min(0).default(0),
  DD_Curr: z.number().min(0).default(0),
  DD_Hist: z.number().min(0).default(0),
  R2: z.number().min(0).default(0),
  P: z.number().min(0).default(0),
  RedTarget: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Iso_50001_baselineInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Energy / input.Volume; results["EnPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnPI"] = Number.NaN; }
  results["Baseline"] = Number.NaN;
  try { const v = input.Actual - input.Predicted; results["Cusum_t"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cusum_t"] = Number.NaN; }
  results["Cusum_Cum"] = Number.NaN;
  try { const v = input.Predicted - input.Actual; results["Savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Savings"] = Number.NaN; }
  try { const v = input.DD_Curr / input.DD_Hist; results["Norm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Norm"] = Number.NaN; }
  results["Sig"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["Baseline"])) * (1 - input.RedTarget); results["Target"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Target"] = Number.NaN; }
  return results;
}


export function calculateIso_50001_baseline(input: Iso_50001_baselineInput): Iso_50001_baselineOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Target"]);
  const breakdown = {
    EnPI: toNumericFormulaValue(values["EnPI"]),
    Baseline: toNumericFormulaValue(values["Baseline"]),
    Cusum_t: toNumericFormulaValue(values["Cusum_t"]),
    Cusum_Cum: toNumericFormulaValue(values["Cusum_Cum"]),
    Savings: toNumericFormulaValue(values["Savings"]),
    Norm: toNumericFormulaValue(values["Norm"]),
    Sig: toNumericFormulaValue(values["Sig"]),
    Target: toNumericFormulaValue(values["Target"])
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


export interface Iso_50001_baselineOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { EnPI: number; Baseline: number; Cusum_t: number; Cusum_Cum: number; Savings: number; Norm: number; Sig: number; Target: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Iso_50001_baselineOutputMeta = {
  primaryKey: "Target",
  unit: "USD",
  breakdownKeys: ["EnPI","Baseline","Cusum_t","Cusum_Cum","Savings","Norm","Sig","Target"],
} as const;

