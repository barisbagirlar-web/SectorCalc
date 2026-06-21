// Auto-generated from haccp-deviation-schema.json
import * as z from 'zod';

export interface Haccp_deviationInput {
  QuarVol: number;
  HoldCost: number;
  Days: number;
  Samples: number;
  LabCost: number;
  DevVol: number;
  ReworkCost: number;
  CondVol: number;
  DispCost: number;
  LostMat: number;
  Notif: number;
  Log_Rev: number;
  RetailPen: number;
  Brand: number;
  ProbDet: number;
  FineAmt: number;
  Hold: number;
  Test: number;
  Rework: number;
  Disp: number;
  Recall: number;
  Sev: number;
  Occ: number;
  Det: number;
  dataConfidence?: number;
}

export const Haccp_deviationInputSchema = z.object({
  QuarVol: z.number().min(0).default(0),
  HoldCost: z.number().min(0).default(0),
  Days: z.number().min(0).default(0),
  Samples: z.number().min(0).default(0),
  LabCost: z.number().min(0).default(0),
  DevVol: z.number().min(0).default(0),
  ReworkCost: z.number().min(0).default(0),
  CondVol: z.number().min(0).default(0),
  DispCost: z.number().min(0).default(0),
  LostMat: z.number().min(0).default(0),
  Notif: z.number().min(0).default(0),
  Log_Rev: z.number().min(0).default(0),
  RetailPen: z.number().min(0).default(0),
  Brand: z.number().min(0).default(0),
  ProbDet: z.number().min(0).default(0),
  FineAmt: z.number().min(0).default(0),
  Hold: z.number().min(0).default(0),
  Test: z.number().min(0).default(0),
  Rework: z.number().min(0).default(0),
  Disp: z.number().min(0).default(0),
  Recall: z.number().min(0).default(0),
  Sev: z.number().min(0).default(0),
  Occ: z.number().min(0).default(0),
  Det: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Haccp_deviationInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.QuarVol * input.HoldCost * input.Days; results["Cost_Hold"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Hold"] = Number.NaN; }
  try { const v = input.Samples * input.LabCost; results["Cost_Test"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Test"] = Number.NaN; }
  try { const v = input.DevVol * input.ReworkCost; results["Cost_Rework"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Rework"] = Number.NaN; }
  try { const v = input.CondVol * input.DispCost + input.LostMat; results["Cost_Disp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Disp"] = Number.NaN; }
  try { const v = input.Notif + input.Log_Rev + input.RetailPen + input.Brand; results["Cost_Recall"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Recall"] = Number.NaN; }
  try { const v = input.ProbDet * input.FineAmt; results["Fine"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Fine"] = Number.NaN; }
  try { const v = input.Hold + input.Test + input.Rework + input.Disp + input.Recall + (toNumericFormulaValue(results["Fine"])); results["Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Total"] = Number.NaN; }
  try { const v = input.Sev * input.Occ * input.Det; results["RPN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RPN"] = Number.NaN; }
  return results;
}


export function calculateHaccp_deviation(input: Haccp_deviationInput): Haccp_deviationOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["RPN"]);
  const breakdown = {
    Cost_Hold: toNumericFormulaValue(values["Cost_Hold"]),
    Cost_Test: toNumericFormulaValue(values["Cost_Test"]),
    Cost_Rework: toNumericFormulaValue(values["Cost_Rework"]),
    Cost_Disp: toNumericFormulaValue(values["Cost_Disp"]),
    Cost_Recall: toNumericFormulaValue(values["Cost_Recall"]),
    Fine: toNumericFormulaValue(values["Fine"]),
    Total: toNumericFormulaValue(values["Total"]),
    RPN: toNumericFormulaValue(values["RPN"])
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


export interface Haccp_deviationOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Cost_Hold: number; Cost_Test: number; Cost_Rework: number; Cost_Disp: number; Cost_Recall: number; Fine: number; Total: number; RPN: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Haccp_deviationOutputMeta = {
  primaryKey: "RPN",
  unit: "USD",
  breakdownKeys: ["Cost_Hold","Cost_Test","Cost_Rework","Cost_Disp","Cost_Recall","Fine","Total","RPN"],
} as const;

