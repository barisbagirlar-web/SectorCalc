// Auto-generated from cpm-gecikme-cezasi-schema.json
import * as z from 'zod';

export interface Cpm_gecikme_cezasiInput {
  LateStart: number;
  EarlyStart: number;
  Actual: number;
  Planned: number;
  ForceMajeure: number;
  OwnerCaused: number;
  Excusable: number;
  DailyPenalty: number;
  CrashingCost: number;
  DaysAccelerated: number;
  EffFactor: number;
  dataConfidence?: number;
}

export const Cpm_gecikme_cezasiInputSchema = z.object({
  LateStart: z.number().min(0).default(0),
  EarlyStart: z.number().min(0).default(0),
  Actual: z.number().min(0).default(0),
  Planned: z.number().min(0).default(0),
  ForceMajeure: z.number().min(0).default(0),
  OwnerCaused: z.number().min(0).default(0),
  Excusable: z.number().min(0).default(0),
  DailyPenalty: z.number().min(0).default(0),
  CrashingCost: z.number().min(0).default(0),
  DaysAccelerated: z.number().min(0).default(0),
  EffFactor: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cpm_gecikme_cezasiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.LateStart - input.EarlyStart; results["TotalFloat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalFloat"] = Number.NaN; }
  try { const v = Math.max(0, input.Actual - input.Planned - (toNumericFormulaValue(results["TotalFloat"]))); results["CriticalDelay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CriticalDelay"] = Number.NaN; }
  try { const v = input.ForceMajeure + input.OwnerCaused; results["ExcusableDelay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ExcusableDelay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CriticalDelay"])) - input.Excusable; results["NonExcusable"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NonExcusable"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["NonExcusable"])) * input.DailyPenalty; results["LiquidatedDamages"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LiquidatedDamages"] = Number.NaN; }
  try { const v = input.CrashingCost * input.DaysAccelerated; results["AccelerationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AccelerationCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["LiquidatedDamages"])) - (toNumericFormulaValue(results["AccelerationCost"])); results["NetPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetPenalty"] = Number.NaN; }
  try { const v = input.Excusable * (1 - input.EffFactor); results["EOT_Claim"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EOT_Claim"] = Number.NaN; }
  return results;
}


export function calculateCpm_gecikme_cezasi(input: Cpm_gecikme_cezasiInput): Cpm_gecikme_cezasiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["EOT_Claim"]);
  const breakdown = {
    TotalFloat: toNumericFormulaValue(values["TotalFloat"]),
    CriticalDelay: toNumericFormulaValue(values["CriticalDelay"]),
    ExcusableDelay: toNumericFormulaValue(values["ExcusableDelay"]),
    NonExcusable: toNumericFormulaValue(values["NonExcusable"]),
    LiquidatedDamages: toNumericFormulaValue(values["LiquidatedDamages"]),
    AccelerationCost: toNumericFormulaValue(values["AccelerationCost"]),
    NetPenalty: toNumericFormulaValue(values["NetPenalty"]),
    EOT_Claim: toNumericFormulaValue(values["EOT_Claim"])
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


export interface Cpm_gecikme_cezasiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TotalFloat: number; CriticalDelay: number; ExcusableDelay: number; NonExcusable: number; LiquidatedDamages: number; AccelerationCost: number; NetPenalty: number; EOT_Claim: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cpm_gecikme_cezasiOutputMeta = {
  primaryKey: "EOT_Claim",
  unit: "USD",
  breakdownKeys: ["TotalFloat","CriticalDelay","ExcusableDelay","NonExcusable","LiquidatedDamages","AccelerationCost","NetPenalty","EOT_Claim"],
} as const;

