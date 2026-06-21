// Auto-generated from gage-rr-maliyet-schema.json
import * as z from 'zod';

export interface Gage_rr_maliyetInput {
  Range_Avg: number;
  d2_star: number;
  Range_Ops: number;
  n: number;
  r: number;
  Range_Parts: number;
  FalseAcc: number;
  EscapeCost: number;
  FalseRej: number;
  ScrapCost: number;
  TotalQualCost: number;
  dataConfidence?: number;
}

export const Gage_rr_maliyetInputSchema = z.object({
  Range_Avg: z.number().min(0).default(0),
  d2_star: z.number().min(0).default(0),
  Range_Ops: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  r: z.number().min(0).default(0),
  Range_Parts: z.number().min(0).default(0),
  FalseAcc: z.number().min(0).default(0),
  EscapeCost: z.number().min(0).default(0),
  FalseRej: z.number().min(0).default(0),
  ScrapCost: z.number().min(0).default(0),
  TotalQualCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gage_rr_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Range_Avg * input.d2_star; results["EV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EV"] = Number.NaN; }
  try { const v = Math.sqrt((input.Range_Ops / input.d2_star)**2 - ((toNumericFormulaValue(results["EV"]))**2 / (input.n * input.r))); results["AV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AV"] = Number.NaN; }
  try { const v = Math.sqrt((toNumericFormulaValue(results["EV"]))**2 + (toNumericFormulaValue(results["AV"]))**2); results["GRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["GRR"] = Number.NaN; }
  try { const v = input.Range_Parts / input.d2_star; results["PV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PV"] = Number.NaN; }
  try { const v = Math.sqrt((toNumericFormulaValue(results["GRR"]))**2 + (toNumericFormulaValue(results["PV"]))**2); results["TV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TV"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["GRR"])) / (toNumericFormulaValue(results["TV"]))) * 100; results["PctGRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PctGRR"] = Number.NaN; }
  try { const v = (input.FalseAcc * input.EscapeCost) + (input.FalseRej * input.ScrapCost); results["CostError"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostError"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["GRR"])) * 6; results["OptTol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptTol"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PctGRR"])) * input.TotalQualCost; results["FinImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinImpact"] = Number.NaN; }
  return results;
}


export function calculateGage_rr_maliyet(input: Gage_rr_maliyetInput): Gage_rr_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["FinImpact"]);
  const breakdown = {
    EV: toNumericFormulaValue(values["EV"]),
    AV: toNumericFormulaValue(values["AV"]),
    GRR: toNumericFormulaValue(values["GRR"]),
    PV: toNumericFormulaValue(values["PV"]),
    TV: toNumericFormulaValue(values["TV"]),
    PctGRR: toNumericFormulaValue(values["PctGRR"]),
    CostError: toNumericFormulaValue(values["CostError"]),
    OptTol: toNumericFormulaValue(values["OptTol"]),
    FinImpact: toNumericFormulaValue(values["FinImpact"])
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


export interface Gage_rr_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { EV: number; AV: number; GRR: number; PV: number; TV: number; PctGRR: number; CostError: number; OptTol: number; FinImpact: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gage_rr_maliyetOutputMeta = {
  primaryKey: "FinImpact",
  unit: "USD",
  breakdownKeys: ["EV","AV","GRR","PV","TV","PctGRR","CostError","OptTol","FinImpact"],
} as const;

