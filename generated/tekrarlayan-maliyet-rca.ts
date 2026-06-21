// Auto-generated from tekrarlayan-maliyet-rca-schema.json
import * as z from 'zod';

export interface Tekrarlayan_maliyet_rcaInput {
  Frequency: number;
  CostPerEvent: number;
  r: number;
  n: number;
  CorrectiveActionCost: number;
  ImplementationCost: number;
  dataConfidence?: number;
}

export const Tekrarlayan_maliyet_rcaInputSchema = z.object({
  Frequency: z.number().min(0).default(0),
  CostPerEvent: z.number().min(0).default(0),
  r: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  CorrectiveActionCost: z.number().min(0).default(0),
  ImplementationCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tekrarlayan_maliyet_rcaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Frequency * input.CostPerEvent; results["RecurringCost_Annual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RecurringCost_Annual"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["RecurringCost_Annual"])) * ((1 - (1+input.r)^-input.n) / input.r); results["PresentValue_Recurring"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PresentValue_Recurring"] = Number.NaN; }
  try { const v = input.CorrectiveActionCost + input.ImplementationCost; results["RootCauseInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RootCauseInvestment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["RootCauseInvestment"])) / (toNumericFormulaValue(results["RecurringCost_Annual"])); results["PaybackPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PaybackPeriod"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PresentValue_Recurring"])) - (toNumericFormulaValue(results["RootCauseInvestment"])); results["NPV_Elimination"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NPV_Elimination"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["RootCauseInvestment"])) / input.CostPerEvent; results["BreakevenFrequency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BreakevenFrequency"] = Number.NaN; }
  return results;
}


export function calculateTekrarlayan_maliyet_rca(input: Tekrarlayan_maliyet_rcaInput): Tekrarlayan_maliyet_rcaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["BreakevenFrequency"]);
  const breakdown = {
    RecurringCost_Annual: toNumericFormulaValue(values["RecurringCost_Annual"]),
    PresentValue_Recurring: toNumericFormulaValue(values["PresentValue_Recurring"]),
    RootCauseInvestment: toNumericFormulaValue(values["RootCauseInvestment"]),
    PaybackPeriod: toNumericFormulaValue(values["PaybackPeriod"]),
    NPV_Elimination: toNumericFormulaValue(values["NPV_Elimination"]),
    BreakevenFrequency: toNumericFormulaValue(values["BreakevenFrequency"])
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


export interface Tekrarlayan_maliyet_rcaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { RecurringCost_Annual: number; PresentValue_Recurring: number; RootCauseInvestment: number; PaybackPeriod: number; NPV_Elimination: number; BreakevenFrequency: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tekrarlayan_maliyet_rcaOutputMeta = {
  primaryKey: "BreakevenFrequency",
  unit: "USD",
  breakdownKeys: ["RecurringCost_Annual","PresentValue_Recurring","RootCauseInvestment","PaybackPeriod","NPV_Elimination","BreakevenFrequency"],
} as const;

