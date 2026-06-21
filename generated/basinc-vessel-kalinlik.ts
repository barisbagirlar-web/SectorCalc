// Auto-generated from basinc-vessel-kalinlik-schema.json
import * as z from 'zod';

export interface Basinc_vessel_kalinlikInput {
  P: number;
  R: number;
  S: number;
  E: number;
  C_A: number;
  D: number;
  L: number;
  r: number;
  t: number;
  dataConfidence?: number;
}

export const Basinc_vessel_kalinlikInputSchema = z.object({
  P: z.number().min(0).default(0),
  R: z.number().min(0).default(0),
  S: z.number().min(0).default(0),
  E: z.number().min(0).default(0),
  C_A: z.number().min(0).default(0),
  D: z.number().min(0).default(0),
  L: z.number().min(0).default(0),
  r: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Basinc_vessel_kalinlikInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.P * input.R) / (input.S * input.E - 0.6 * input.P) + input.C_A; results["t_shell"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["t_shell"] = Number.NaN; }
  try { const v = (input.P * input.R) / (2 * input.S * input.E - 0.2 * input.P) + input.C_A; results["t_sphere"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["t_sphere"] = Number.NaN; }
  try { const v = (input.P * input.D) / (2 * input.S * input.E - 0.2 * input.P) + input.C_A; results["t_head_ellip"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["t_head_ellip"] = Number.NaN; }
  try { const v = 0.25 * (3 + Math.sqrt(input.L/input.r))**2; results["M"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["M"] = Number.NaN; }
  try { const v = (input.P * input.L * (toNumericFormulaValue(results["M"]))) / (2 * input.S * input.E - 0.2 * input.P) + input.C_A; results["t_head_tori"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["t_head_tori"] = Number.NaN; }
  try { const v = (input.S * input.E * (input.t - input.C_A)) / (input.R + 0.6 * (input.t - input.C_A)); results["MAWP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MAWP"] = Number.NaN; }
  return results;
}


export function calculateBasinc_vessel_kalinlik(input: Basinc_vessel_kalinlikInput): Basinc_vessel_kalinlikOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["MAWP"]);
  const breakdown = {
    t_shell: toNumericFormulaValue(values["t_shell"]),
    t_sphere: toNumericFormulaValue(values["t_sphere"]),
    t_head_ellip: toNumericFormulaValue(values["t_head_ellip"]),
    M: toNumericFormulaValue(values["M"]),
    t_head_tori: toNumericFormulaValue(values["t_head_tori"]),
    MAWP: toNumericFormulaValue(values["MAWP"])
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


export interface Basinc_vessel_kalinlikOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { t_shell: number; t_sphere: number; t_head_ellip: number; M: number; t_head_tori: number; MAWP: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Basinc_vessel_kalinlikOutputMeta = {
  primaryKey: "MAWP",
  unit: "USD",
  breakdownKeys: ["t_shell","t_sphere","t_head_ellip","M","t_head_tori","MAWP"],
} as const;

