// Auto-generated from yenileme-butcesi-optimize-edici-schema.json
import * as z from 'zod';

export interface Yenileme_butcesi_optimize_ediciInput {
  Area: number;
  CostPerSqM_ByComplexity: number;
  InflationRate: number;
  ProjectDuration: number;
  RiskFactor: number;
  DesignFeePct: number;
  PermitFeePct: number;
  FF_E: number;
  NewPropertyValue: number;
  OldPropertyValue: number;
  dataConfidence?: number;
}

export const Yenileme_butcesi_optimize_ediciInputSchema = z.object({
  Area: z.number().min(0).default(0),
  CostPerSqM_ByComplexity: z.number().min(0).default(0),
  InflationRate: z.number().min(0).default(0),
  ProjectDuration: z.number().min(0).default(0),
  RiskFactor: z.number().min(0).default(0),
  DesignFeePct: z.number().min(0).default(0),
  PermitFeePct: z.number().min(0).default(0),
  FF_E: z.number().min(0).default(0),
  NewPropertyValue: z.number().min(0).default(0),
  OldPropertyValue: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yenileme_butcesi_optimize_ediciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Area * input.CostPerSqM_ByComplexity; results["BaseCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BaseCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["BaseCost"])) * ((1 + input.InflationRate)^input.ProjectDuration - 1); results["Escalation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Escalation"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["BaseCost"])) + (toNumericFormulaValue(results["Escalation"]))) * input.RiskFactor; results["Contingency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Contingency"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["BaseCost"])) + (toNumericFormulaValue(results["Escalation"]))) * (input.DesignFeePct + input.PermitFeePct); results["SoftCosts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SoftCosts"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["BaseCost"])) + (toNumericFormulaValue(results["Escalation"])) + (toNumericFormulaValue(results["Contingency"])) + (toNumericFormulaValue(results["SoftCosts"])) + input.FF_E; results["TotalBudget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalBudget"] = Number.NaN; }
  try { const v = (input.NewPropertyValue - input.OldPropertyValue - (toNumericFormulaValue(results["TotalBudget"]))) / (toNumericFormulaValue(results["TotalBudget"])); results["ROI_Renovation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI_Renovation"] = Number.NaN; }
  return results;
}


export function calculateYenileme_butcesi_optimize_edici(input: Yenileme_butcesi_optimize_ediciInput): Yenileme_butcesi_optimize_ediciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ROI_Renovation"]);
  const breakdown = {
    BaseCost: toNumericFormulaValue(values["BaseCost"]),
    Escalation: toNumericFormulaValue(values["Escalation"]),
    Contingency: toNumericFormulaValue(values["Contingency"]),
    SoftCosts: toNumericFormulaValue(values["SoftCosts"]),
    TotalBudget: toNumericFormulaValue(values["TotalBudget"]),
    ROI_Renovation: toNumericFormulaValue(values["ROI_Renovation"])
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


export interface Yenileme_butcesi_optimize_ediciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { BaseCost: number; Escalation: number; Contingency: number; SoftCosts: number; TotalBudget: number; ROI_Renovation: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yenileme_butcesi_optimize_ediciOutputMeta = {
  primaryKey: "ROI_Renovation",
  unit: "USD",
  breakdownKeys: ["BaseCost","Escalation","Contingency","SoftCosts","TotalBudget","ROI_Renovation"],
} as const;

