// Auto-generated from orneklem-buyuklugu-endustri-muhendisligi-schema.json
import * as z from 'zod';

export interface Orneklem_buyuklugu_endustri_muhendisligiInput {
  Z: number;
  p: number;
  E: number;
  N: number;
  Sigma: number;
  n: number;
  Z_beta: number;
  Z_alpha: number;
  ClusterSize: number;
  ICC: number;
  CostPerUnit: number;
  dataConfidence?: number;
}

export const Orneklem_buyuklugu_endustri_muhendisligiInputSchema = z.object({
  Z: z.number().min(0).default(0),
  p: z.number().min(0).default(0),
  E: z.number().min(0).default(0),
  N: z.number().min(0).default(0),
  Sigma: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  Z_beta: z.number().min(0).default(0),
  Z_alpha: z.number().min(0).default(0),
  ClusterSize: z.number().min(0).default(0),
  ICC: z.number().min(0).default(0),
  CostPerUnit: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Orneklem_buyuklugu_endustri_muhendisligiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.Z**2 * input.p * (1-input.p)) / input.E**2; results["n_Infinite"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n_Infinite"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["n_Infinite"])) / (1 + (((toNumericFormulaValue(results["n_Infinite"])) - 1) / input.N)); results["n_Finite"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n_Finite"] = Number.NaN; }
  try { const v = (input.Z * input.Sigma / input.E)**2; results["n_Continuous"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n_Continuous"] = Number.NaN; }
  try { const v = input.n * (1 + (input.Z_beta / input.Z_alpha)**2); results["Power_Adjusted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Power_Adjusted"] = Number.NaN; }
  try { const v = 1 + (input.ClusterSize - 1) * input.ICC; results["DesignEffect"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DesignEffect"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["n_Finite"])) * (toNumericFormulaValue(results["DesignEffect"])); results["Final_n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Final_n"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Final_n"])) * input.CostPerUnit; results["Cost_Sampling"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Sampling"] = Number.NaN; }
  return results;
}


export function calculateOrneklem_buyuklugu_endustri_muhendisligi(input: Orneklem_buyuklugu_endustri_muhendisligiInput): Orneklem_buyuklugu_endustri_muhendisligiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Cost_Sampling"]);
  const breakdown = {
    n_Infinite: toNumericFormulaValue(values["n_Infinite"]),
    n_Finite: toNumericFormulaValue(values["n_Finite"]),
    n_Continuous: toNumericFormulaValue(values["n_Continuous"]),
    Power_Adjusted: toNumericFormulaValue(values["Power_Adjusted"]),
    DesignEffect: toNumericFormulaValue(values["DesignEffect"]),
    Final_n: toNumericFormulaValue(values["Final_n"]),
    Cost_Sampling: toNumericFormulaValue(values["Cost_Sampling"])
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


export interface Orneklem_buyuklugu_endustri_muhendisligiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { n_Infinite: number; n_Finite: number; n_Continuous: number; Power_Adjusted: number; DesignEffect: number; Final_n: number; Cost_Sampling: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Orneklem_buyuklugu_endustri_muhendisligiOutputMeta = {
  primaryKey: "Cost_Sampling",
  unit: "USD",
  breakdownKeys: ["n_Infinite","n_Finite","n_Continuous","Power_Adjusted","DesignEffect","Final_n","Cost_Sampling"],
} as const;

