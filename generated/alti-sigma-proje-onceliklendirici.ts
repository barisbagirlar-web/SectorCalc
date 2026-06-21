// Auto-generated from alti-sigma-proje-onceliklendirici-schema.json
import * as z from 'zod';

export interface Alti_sigma_proje_onceliklendiriciInput {
  Defects: number;
  Units: number;
  Opportunities: number;
  InternalFailure: number;
  ExternalFailure: number;
  Appraisal: number;
  Prevention: number;
  RecoveryProb: number;
  SigmaGap: number;
  StrategicAlignment: number;
  Ease: number;
  dataConfidence?: number;
}

export const Alti_sigma_proje_onceliklendiriciInputSchema = z.object({
  Defects: z.number().min(0).default(0),
  Units: z.number().min(0).default(0),
  Opportunities: z.number().min(0).default(0),
  InternalFailure: z.number().min(0).default(0),
  ExternalFailure: z.number().min(0).default(0),
  Appraisal: z.number().min(0).default(0),
  Prevention: z.number().min(0).default(0),
  RecoveryProb: z.number().min(0).default(0),
  SigmaGap: z.number().min(0).default(0),
  StrategicAlignment: z.number().min(0).default(0),
  Ease: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Alti_sigma_proje_onceliklendiriciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.Defects / (input.Units * input.Opportunities)) * 1000000; results["DPMO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DPMO"] = Number.NaN; }
  try { const v = 1 - (input.Defects / (input.Units * input.Opportunities)); results["Yield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Yield"] = Number.NaN; }
  results["Z_bench"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["Z_bench"])) + 1.5; results["SigmaLevel"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SigmaLevel"] = Number.NaN; }
  try { const v = input.InternalFailure + input.ExternalFailure + input.Appraisal + input.Prevention; results["COPQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["COPQ"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["COPQ"])) * input.RecoveryProb * 0.35) + (input.SigmaGap * 0.25) + (input.StrategicAlignment * 0.25) + (input.Ease * 0.15); results["ProjectScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProjectScore"] = Number.NaN; }
  return results;
}


export function calculateAlti_sigma_proje_onceliklendirici(input: Alti_sigma_proje_onceliklendiriciInput): Alti_sigma_proje_onceliklendiriciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ProjectScore"]);
  const breakdown = {
    DPMO: toNumericFormulaValue(values["DPMO"]),
    Yield: toNumericFormulaValue(values["Yield"]),
    Z_bench: toNumericFormulaValue(values["Z_bench"]),
    SigmaLevel: toNumericFormulaValue(values["SigmaLevel"]),
    COPQ: toNumericFormulaValue(values["COPQ"]),
    ProjectScore: toNumericFormulaValue(values["ProjectScore"])
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


export interface Alti_sigma_proje_onceliklendiriciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { DPMO: number; Yield: number; Z_bench: number; SigmaLevel: number; COPQ: number; ProjectScore: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Alti_sigma_proje_onceliklendiriciOutputMeta = {
  primaryKey: "ProjectScore",
  unit: "USD",
  breakdownKeys: ["DPMO","Yield","Z_bench","SigmaLevel","COPQ","ProjectScore"],
} as const;

