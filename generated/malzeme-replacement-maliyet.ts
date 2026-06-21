// Auto-generated from malzeme-replacement-maliyet-schema.json
import * as z from 'zod';

export interface Malzeme_replacement_maliyetInput {
  MatCost_Current: number;
  ProcessingCost_Current: number;
  LifecycleMaint_Current: number;
  DisposalCost_Current: number;
  MatCost_Alt: number;
  ProcessingCost_Alt: number;
  LifecycleMaint_Alt: number;
  DisposalCost_Alt: number;
  Weight_Current: number;
  Weight_Alt: number;
  FuelFactor: number;
  LifecycleDistance: number;
  FuelPrice: number;
  QualityPremium: number;
  ToolingCost_Alt: number;
  QualificationCost: number;
  AnnualNetBenefit: number;
  dataConfidence?: number;
}

export const Malzeme_replacement_maliyetInputSchema = z.object({
  MatCost_Current: z.number().min(0).default(0),
  ProcessingCost_Current: z.number().min(0).default(0),
  LifecycleMaint_Current: z.number().min(0).default(0),
  DisposalCost_Current: z.number().min(0).default(0),
  MatCost_Alt: z.number().min(0).default(0),
  ProcessingCost_Alt: z.number().min(0).default(0),
  LifecycleMaint_Alt: z.number().min(0).default(0),
  DisposalCost_Alt: z.number().min(0).default(0),
  Weight_Current: z.number().min(0).default(0),
  Weight_Alt: z.number().min(0).default(0),
  FuelFactor: z.number().min(0).default(0),
  LifecycleDistance: z.number().min(0).default(0),
  FuelPrice: z.number().min(0).default(0),
  QualityPremium: z.number().min(0).default(0),
  ToolingCost_Alt: z.number().min(0).default(0),
  QualificationCost: z.number().min(0).default(0),
  AnnualNetBenefit: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Malzeme_replacement_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.MatCost_Current + input.ProcessingCost_Current + input.LifecycleMaint_Current + input.DisposalCost_Current; results["TCO_Current"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TCO_Current"] = Number.NaN; }
  try { const v = input.MatCost_Alt + input.ProcessingCost_Alt + input.LifecycleMaint_Alt + input.DisposalCost_Alt; results["TCO_Alternative"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TCO_Alternative"] = Number.NaN; }
  try { const v = input.Weight_Current - input.Weight_Alt; results["WeightSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WeightSavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["WeightSavings"])) * input.FuelFactor * input.LifecycleDistance * input.FuelPrice; results["FuelSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FuelSavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TCO_Current"])) - (toNumericFormulaValue(results["TCO_Alternative"])) + (toNumericFormulaValue(results["FuelSavings"])) + input.QualityPremium; results["NetBenefit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetBenefit"] = Number.NaN; }
  try { const v = (input.ToolingCost_Alt + input.QualificationCost) / input.AnnualNetBenefit; results["Payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Payback"] = Number.NaN; }
  return results;
}


export function calculateMalzeme_replacement_maliyet(input: Malzeme_replacement_maliyetInput): Malzeme_replacement_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Payback"]);
  const breakdown = {
    TCO_Current: toNumericFormulaValue(values["TCO_Current"]),
    TCO_Alternative: toNumericFormulaValue(values["TCO_Alternative"]),
    WeightSavings: toNumericFormulaValue(values["WeightSavings"]),
    FuelSavings: toNumericFormulaValue(values["FuelSavings"]),
    NetBenefit: toNumericFormulaValue(values["NetBenefit"]),
    Payback: toNumericFormulaValue(values["Payback"])
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


export interface Malzeme_replacement_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TCO_Current: number; TCO_Alternative: number; WeightSavings: number; FuelSavings: number; NetBenefit: number; Payback: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Malzeme_replacement_maliyetOutputMeta = {
  primaryKey: "Payback",
  unit: "USD",
  breakdownKeys: ["TCO_Current","TCO_Alternative","WeightSavings","FuelSavings","NetBenefit","Payback"],
} as const;

