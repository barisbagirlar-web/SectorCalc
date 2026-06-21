// Auto-generated from taseron-marj-sizinti-dedektoru-schema.json
import * as z from 'zod';

export interface Taseron_marj_sizinti_dedektoruInput {
  ContractValue: number;
  EstimatedSubcontractorCost: number;
  ActualSubcontractorCost: number;
  ReworkCost: number;
  DelayPenalties: number;
  ChangeOrderAmount_i: number;
  ActualWorkCompleted: number;
  BilledAmount: number;
  dataConfidence?: number;
}

export const Taseron_marj_sizinti_dedektoruInputSchema = z.object({
  ContractValue: z.number().min(0).default(0),
  EstimatedSubcontractorCost: z.number().min(0).default(0),
  ActualSubcontractorCost: z.number().min(0).default(0),
  ReworkCost: z.number().min(0).default(0),
  DelayPenalties: z.number().min(0).default(0),
  ChangeOrderAmount_i: z.number().min(0).default(0),
  ActualWorkCompleted: z.number().min(0).default(0),
  BilledAmount: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Taseron_marj_sizinti_dedektoruInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.ContractValue - input.EstimatedSubcontractorCost) / input.ContractValue; results["QuotedMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["QuotedMargin"] = Number.NaN; }
  try { const v = (input.ContractValue - input.ActualSubcontractorCost - input.ReworkCost - input.DelayPenalties) / input.ContractValue; results["ActualMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualMargin"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["QuotedMargin"])) - (toNumericFormulaValue(results["ActualMargin"])); results["MarginLeak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MarginLeak"] = Number.NaN; }
  results["ChangeOrderCost"] = Number.NaN;
  try { const v = input.ActualWorkCompleted - input.BilledAmount; results["UnbilledWork"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["UnbilledWork"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["MarginLeak"])) / (toNumericFormulaValue(results["QuotedMargin"])); results["LeakagePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LeakagePct"] = Number.NaN; }
  return results;
}


export function calculateTaseron_marj_sizinti_dedektoru(input: Taseron_marj_sizinti_dedektoruInput): Taseron_marj_sizinti_dedektoruOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["LeakagePct"]);
  const breakdown = {
    QuotedMargin: toNumericFormulaValue(values["QuotedMargin"]),
    ActualMargin: toNumericFormulaValue(values["ActualMargin"]),
    MarginLeak: toNumericFormulaValue(values["MarginLeak"]),
    ChangeOrderCost: toNumericFormulaValue(values["ChangeOrderCost"]),
    UnbilledWork: toNumericFormulaValue(values["UnbilledWork"]),
    LeakagePct: toNumericFormulaValue(values["LeakagePct"])
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


export interface Taseron_marj_sizinti_dedektoruOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { QuotedMargin: number; ActualMargin: number; MarginLeak: number; ChangeOrderCost: number; UnbilledWork: number; LeakagePct: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Taseron_marj_sizinti_dedektoruOutputMeta = {
  primaryKey: "LeakagePct",
  unit: "USD",
  breakdownKeys: ["QuotedMargin","ActualMargin","MarginLeak","ChangeOrderCost","UnbilledWork","LeakagePct"],
} as const;

