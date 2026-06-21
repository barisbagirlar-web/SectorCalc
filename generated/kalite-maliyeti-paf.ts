// Auto-generated from kalite-maliyeti-paf-schema.json
import * as z from 'zod';

export interface Kalite_maliyeti_pafInput {
  Training: number;
  QualityPlanning: number;
  SupplierEvaluation: number;
  DesignReview: number;
  Inspection: number;
  Testing: number;
  Calibration: number;
  Audit: number;
  Scrap: number;
  Rework: number;
  Reinspection: number;
  Downtime: number;
  Warranty: number;
  Returns: number;
  Recall: number;
  Liability: number;
  LostSales: number;
  TotalRevenue: number;
  dataConfidence?: number;
}

export const Kalite_maliyeti_pafInputSchema = z.object({
  Training: z.number().min(0).default(0),
  QualityPlanning: z.number().min(0).default(0),
  SupplierEvaluation: z.number().min(0).default(0),
  DesignReview: z.number().min(0).default(0),
  Inspection: z.number().min(0).default(0),
  Testing: z.number().min(0).default(0),
  Calibration: z.number().min(0).default(0),
  Audit: z.number().min(0).default(0),
  Scrap: z.number().min(0).default(0),
  Rework: z.number().min(0).default(0),
  Reinspection: z.number().min(0).default(0),
  Downtime: z.number().min(0).default(0),
  Warranty: z.number().min(0).default(0),
  Returns: z.number().min(0).default(0),
  Recall: z.number().min(0).default(0),
  Liability: z.number().min(0).default(0),
  LostSales: z.number().min(0).default(0),
  TotalRevenue: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kalite_maliyeti_pafInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Training + input.QualityPlanning + input.SupplierEvaluation + input.DesignReview; results["PreventionCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PreventionCost"] = Number.NaN; }
  try { const v = input.Inspection + input.Testing + input.Calibration + input.Audit; results["AppraisalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AppraisalCost"] = Number.NaN; }
  try { const v = input.Scrap + input.Rework + input.Reinspection + input.Downtime; results["InternalFailure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["InternalFailure"] = Number.NaN; }
  try { const v = input.Warranty + input.Returns + input.Recall + input.Liability + input.LostSales; results["ExternalFailure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ExternalFailure"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PreventionCost"])) + (toNumericFormulaValue(results["AppraisalCost"])) + (toNumericFormulaValue(results["InternalFailure"])) + (toNumericFormulaValue(results["ExternalFailure"])); results["TotalCOQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalCOQ"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalCOQ"])) / input.TotalRevenue; results["COQ_Ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["COQ_Ratio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PreventionCost"])) / (toNumericFormulaValue(results["TotalCOQ"])); results["PAF_Ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PAF_Ratio"] = Number.NaN; }
  return results;
}


export function calculateKalite_maliyeti_paf(input: Kalite_maliyeti_pafInput): Kalite_maliyeti_pafOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["PAF_Ratio"]);
  const breakdown = {
    PreventionCost: toNumericFormulaValue(values["PreventionCost"]),
    AppraisalCost: toNumericFormulaValue(values["AppraisalCost"]),
    InternalFailure: toNumericFormulaValue(values["InternalFailure"]),
    ExternalFailure: toNumericFormulaValue(values["ExternalFailure"]),
    TotalCOQ: toNumericFormulaValue(values["TotalCOQ"]),
    COQ_Ratio: toNumericFormulaValue(values["COQ_Ratio"]),
    PAF_Ratio: toNumericFormulaValue(values["PAF_Ratio"])
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


export interface Kalite_maliyeti_pafOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { PreventionCost: number; AppraisalCost: number; InternalFailure: number; ExternalFailure: number; TotalCOQ: number; COQ_Ratio: number; PAF_Ratio: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kalite_maliyeti_pafOutputMeta = {
  primaryKey: "PAF_Ratio",
  unit: "USD",
  breakdownKeys: ["PreventionCost","AppraisalCost","InternalFailure","ExternalFailure","TotalCOQ","COQ_Ratio","PAF_Ratio"],
} as const;

